const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const app = express() // Express

const {verify} = require('jsonwebtoken')

const mongoRouter = require('./mongo/mongo')
const plaidRouter = require('./plaid/plaid')
const auth = require('./jwt/jwt')
const jwtRouter = auth.router
const {verifyUser} = auth

app.use(cors())
app.use(bodyParser.urlencoded({extended: true})) // Body parser middleware
app.use(bodyParser.json())
app.use(cookieParser())

app.use('/api/user', jwtRouter)
app.use(verifyUser) // Check token and insert username into req.username
app.use('/api/db', mongoRouter) // Mongo query
app.use('/api/plaid', plaidRouter) // Plaid 

app.listen(4500, () => {console.log("Express listened")})