const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const app = express() // Express

// const {verify} = require('jsonwebtoken')
const path = require('path')

const mongoRouter = require('./mongo/mongo')
const plaidRouter = require('./plaid/plaid').router
const auth = require('./jwt/jwt')
const jwtRouter = auth.router
const {verifyUser} = auth // Check token and insert username into req.username

app.use(cors())
app.use(bodyParser.urlencoded({extended: true})) // Body parser middleware
app.use(bodyParser.json())
app.use(cookieParser())

app.use('/api/user', jwtRouter)
app.use('/api/db', [verifyUser, mongoRouter]) // Mongo query
app.use('/api/plaid', [verifyUser, plaidRouter]) // Plaid 
app.use(express.static(path.join(__dirname, 'dist')))

app.listen(80, () => {console.log("Express listened")})