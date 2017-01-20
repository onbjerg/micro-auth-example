const { json, send, createError } = require('micro')
const { compareSync } = require('bcrypt')
const { sign } = require('jsonwebtoken')
const knex = require('knex')
const assert = require('assert')

// Check for required environment variables
assert(process.env.PG_CONNECTION_STRING, '`PG_CONNECTION_STRING` not set')
assert(process.env.SECRET, '`SECRET` not set')

// Connect to Postgres
var db = knex({
  client: 'pg',
  connection: process.env.PG_CONNECTION_STRING
})

/**
 * Catch errors from the wrapped function.
 * If any errors are catched, a JSON response is generated for that error.
 */
const handleErrors = (fn) => async (req, res) => {
  try {
    return await fn(req, res)
  } catch (err) {
    if (process.env.NODE_ENV !== 'production' &&
      err.stack) {
      console.error(err.stack)
    }

    send(res, err.statusCode || 500, {
      error: true,
      message: err.message
    })
  }
}

/**
 * Attempt to authenticate a user.
 */
const attempt = (email, password) =>
  db('users').where({
    email,
    password
  })
  .select('id')
  .then((users) => {
    if (!users.length) {
      throw createError(401, 'Not authenticated')
    }

    const user = users[0]
    if (!compareSync(password, user.password)) {
      throw createError(401, 'Not authenticated')
    }

    return user
  })

/**
 * Authenticate a user and generate a JWT if successful.
 */
const auth = ({ email, password }) =>
  attempt(email, password)
  .then(({ id }) => ({
    token: sign({
      id
    }, process.env.SECRET)
  }))

module.exports = handleErrors(
  async (req, res) => await auth(
    await json(req)
  )
)