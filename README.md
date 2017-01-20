# Authentication Service Example with Micro

This is a small example of how to write a simple authentication service using [micro](https://github.com/zeit/micro).

The service connects to a Postgresql database using [knex](https://knexjs.org) and issues JWT tokens for successfully authenticated users.

**Example Request**
```bash
curl http://localhost:3000/ \
  -H "Content-Type: application/json" \
  -d '{"email": "x@y.z", "password": "foobar"}' 
```