# Authentication Service Example with Micro

This is a small example of how to write a simple authentication service using [micro](https://github.com/zeit/micro).

The service connects to a Postgresql database using [knex](https://knexjs.org) and issues JWT tokens for successfully authenticated users.

**Example Request**
```bash
curl http://localhost:3000/ \
  -H "Content-Type: application/json" \
  -d '{"email": "x@y.z", "password": "foobar"}' 
```

**Example Response (HTTP 200)**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MX0.tjVEMiS5O2yNzclwLdaZ-FuzrhyqOT7UwM9Hfc0ZQ8Q"
}
```

**Example Response (HTTP 401)**
```json
{
  "error": true,
  "message": "Not authenticated"
}
```

## Running

```bash
# Clone the repository
git clone git@github.com:onbjerg/micro-auth-example

# Install the dependencies
yarn

# Start the service (remember to set the env vars!)
SECRET=i-like-romantic-movies
PG_CONNECTION_STRING=postgres://user:pass@psotgres/
yarn start
```