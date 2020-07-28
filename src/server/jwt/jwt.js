const router = require('express').Router()

/* Hashing */
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const SALTROUNDS = 10

const jwt = require('jsonwebtoken')
// const jwtConfig = require('./jwt.config')
const jwtConfig = {
    secret: process.env.JWT_SECRET
}

/* MongoDB */
const mongoConnection = require('../mongo/mongo.connection')

/**
 * Sign up a user
 */

router.route('/signup').post(async (req, res, next) => {
    let userDb = await mongoConnection.getCollection('user')
    userDb.find({username: req.body.username}, {projection:{_id:0}}).toArray((err, items) => {
        if (err !== null) // Internal mongo error
            res.status(500).send({
                success: false,
                error: err.message
            })
        else if (items.length > 0) // Duplicate username
            res.status(400).send({
                success: false,
                error: 'Username is already in use!'
            })
        else {
            let salt = crypto.randomBytes(64).toString('hex')
            
            userDb.insertOne({
                username: req.body.username,
                password: bcrypt.hashSync(req.body.password+salt, SALTROUNDS),
                salt: salt,
                accounts: []
            })
            .then(result => {
                res.status(200).send({
                    success: true
                })
            })
            .catch(err => {
                res.status(500).send({
                    success: false,
                    error: err.message
                })
            })
        }
    })
})

/**
 * Authenticate user and return JWT
 */

router.route('/login').post(async (req, res, next) => {
    let userDb = await mongoConnection.getCollection('user')
    userDb.find({username: req.body.username}, {projection: {_id:0, username:1, password:1, salt:1}}).toArray((err, result) => {
        if (err !== null) // Internal server error
            res.status(500).send({
                success: false,
                error: err.message
            })
        else {
            // No such username or invalid password
            if (result.length === 0 ||
                !bcrypt.compareSync(req.body.password+result[0].salt, result[0].password))
                res.status(400).send({
                    success: false,
                    error: 'Username and/or password does not match any record'
                })
            else if (bcrypt.compareSync(req.body.password+result[0].salt, result[0].password))
                res
                    .status(200)
                    .cookie('access_token', jwt.sign({username: result[0].username}, jwtConfig.secret, {expiresIn: '1d'}), {maxAge: 86400*1000, httpOnly: true})
                    .send({success: true})
            else
                res.status(500).send({
                    success: false,
                    error: 'Unexpected server error'
                })
        }
    })
})

router.route('/logout').post((req, res, next) => {
    res.clearCookie('access_token').send({success: true})
})

const verifyUser = (req, res, next) => {
    let token = req.cookies.access_token

    if (!token)
        return res.status(403).send({
            success: false,
            error: "No token provided!"
        })
    else {
        jwt.verify(token, jwtConfig.secret, (err, decoded) => {
            if (err)
                return res.status(401).clearCookie('access_token').send({
                    success: false,
                    error: "Unauthorized or Invalid token!"
                })
            else {
                req.username = decoded.username
                next()
            }
        })
    }
}

module.exports = {router, verifyUser}