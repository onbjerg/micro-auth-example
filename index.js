import { json, send, createError } from 'micro-core'
import { compareSync } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import knex from 'knex'

// Connect to Postgres
var db = knex({
  client: 'pg',
  connection: process.env.PG_CONNECTION_STRING
})

/**
 * Catch errors from the wrapped function.
 * If any errors are catched, a JSON response is generated for that error.
 */
export const handleErrors = (fn) => async (req, res) => {
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

export default handleErrors(
  async (req, res) => await auth(
    await json(req)
  )
)