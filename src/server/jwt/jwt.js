const router = require('express').Router()
const crypto = require('crypto');

const mongo = require('mongodb').MongoClient // Mongo client
const config = require('../mongo/mongo.config')

let db
let userDb

/* Begin DB connection section */

mongo.connect(config.DBURI+config.DBNAME, {useUnifiedTopology: true})
.then(res => {
    db = res.db()

    if (db === undefined) {
        console.error('db connection failed')
        exit(-1)
    }

    userDb = db.collection(config.COLLECTION)
})
.catch(err => {console.error("Mongo connection failed");exit(-1)})

/* End DB connection section */

/**
 * Sign up a user
 */

router.route('/signup').post((req, res, next) => {
    userDb.find({username: req.body.username}, {projection:{_id:0}}).toArray((err, items) => {
        if (err !== null) // Interal mongo error
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
            const sha256 = crypto.createHash('sha256')
            
            userDb.insertOne({
                username: req.body.username,
                password: sha256.update(req.body.password+salt).digest('hex'),
                salt: salt,
                accounts: []
            })
            .then(result => {
                res.status(200).send({
                    success: false,
                    error: ''
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

router.route('/login').post((req, res, next) => {
    userDb.find({username: req.body.username}, {projection: {_id:0, password:1, salt:1}}).toArray((err, result) => {
        if (err !== null) // Internal server error
            res.status(500).send({
                success: false,
                error: err.message
            })
        else {
            const sha256 = crypto.createHash('sha256')
            const pwdigest = sha256.update(req.body.password+result[0].salt).digest('hex')
            // No such username or invalid password
            if (result.length === 0 ||
                result[0].password !== pwdigest)
                res.status(400).send({
                    success: false,
                    error: 'Username and/or password does not match any record'
                })
            else if (result[0].password === pwdigest)
                res.status(200).send({
                    success: true,
                    error: '',
                    JWT: "PLACEHOLDER FOR SUCCESS TOKEN"
                })
            else
                res.status(500).send({
                    success: false,
                    error: 'Unexpected server error'
                })
        }
    })
})

module.exports = router