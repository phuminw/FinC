const express = require('express')
const { exit } = require('process')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express() // Express

const mongoRouter = require('./mongo/mongo')
const plaidRouter = require('./plaid/plaid')
const jwtRouter = require('./jwt/jwt')

app.use(cors())
app.use(bodyParser.urlencoded({extended: true})) // Body parser middleware
app.use(bodyParser.json())

app.use('/api/user', jwtRouter)
app.use('/api/db', mongoRouter) // Mongo query
app.use('/api/plaid', plaidRouter) // Plaid 

app.listen(4500, () => {console.log("Express listened")})