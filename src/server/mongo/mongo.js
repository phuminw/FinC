const express = require('express')
const router = express.Router()

const mongoConnection = require('./mongo.connection')
// const mongo = require('mongodb').MongoClient // Mongo client
// const config = require('./mongo.config')

// let db
// let userDb = mongoConnection.getDb()

/* Begin DB connection section */

// mongo.connect(config.DBURI+config.DBNAME, {useUnifiedTopology: true})
// .then(res => {
//     db = res.db()

//     if (db === undefined) {
//         console.error('db connection failed')
//         exit(-1)
//     }

//     userDb = db.collection(config.COLLECTION)
// })
// .catch(err => {console.error("Mongo connection failed");exit(-1)})

/* End DB connection section */

/* Mongo: Get username */

router.route('/getUsername').get(async (req, res) => {
    res.header("Content-Type", "application/json")
    if (req.username)
        res.send({success: true, username: req.username})
    else
        res.send({success: false})
})

/* Mongo: Accounts query: get all accounts access token from db */
router.route('/getAccounts').get(async (req, res) => {
    console.log("Got getAccounts query")
    let userDb = await mongoConnection.getCollection('user')
    userDb.find({username: req.username}, {projection:{_id:0, accounts:1}}).toArray((err, items) => {
        if (items.length > 0)
            res.send({
                success: true,
                accessTokens: items[0].accounts
            })
        else
            res.send({
                success: false
            })
    })
})

router.route('/removeAccount').post(async (req, res) => {
    console.log(req.body)
    console.log(`Express removing ${req.body.accessToken} from ${req.username}`)
    res.send({success: true})
    let userDb = await mongoConnection.getCollection('user')
    // userDb.updateOne({username: req.username}, {$pull: {accounts: req.body.accessToken}})
    // .then(updateRes => {
    //     if (updateRes.result.ok && updateRes.result.nModified > 0)
    //         res.send({success: true})
    //     else
    //         res.send({success: false})
    // })
    // .catch(err => {
    //     res.send({success: false})
    // })
})

module.exports = router