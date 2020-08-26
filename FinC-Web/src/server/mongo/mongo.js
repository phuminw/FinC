const express = require('express')
const router = express.Router()

const mongoConnection = require('./mongo.connection')
// const mongo = require('mongodb').MongoClient // Mongo client
// const config = require('./mongo.config')

const bcrypt = require('bcrypt')
const SALTROUNDS = 10

const {getAccountInfo} = require('../plaid/plaid')
// const { Db } = require('mongodb')

/* Mongo: Get username */

router.route('/username').get(async (req, res) => {
    res.header("Content-Type", "application/json")
    if (req.username)
        res.send({success: true, username: req.username})
    else
        res.send({success: false})
})

/* Mongo: return accounts information of all institution of the user */

router.route('/accounts').get(async (req, res) => {
    // console.log("Got getAccounts query")
    
    try {
        let userDb = await mongoConnection.getCollection('user')
        res.header("Content-Type", "application/json")

        let accounts = (await userDb.findOne({username: req.username}, {projection:{_id:0, accounts:1}})).accounts
        let promises = []

        for (const account of accounts) {
                promises.push(getAccountInfo(account))
        }

        res.send({
            success: true,
            institutions: await Promise.all(promises)
        })
    } catch (err) {
        console.log(err)
        res.send({
            success: false,
            error: "Internal Server Error (AccDBErr)"
        })
    }
})

router.route('/insSummary').get(async (req, res) => {
    // {
    //     institution_name: string,
    //     id: string
    // }

    try {
        let userDb = await mongoConnection.getCollection('user')
        res.header("Content-Type", "application/json")
        // const sha256 = require('crypto').createHash('sha256')

        let accounts = (await userDb.findOne({username: req.username}, {projection:{_id:0, accounts:1}})).accounts        
        let summary = []

        for (const account of accounts) {
            summary.push({
                institution_name: account.institution_name,
                id: bcrypt.hashSync(account.access_token, SALTROUNDS)
                // id: sha256.update(account.access_token).digest('base64')
            })
        }

        res.send({
            success: true,
            institutions: summary
        })
    } catch (_) {
        res.send({
            success: false,
            error: "Internal Server Error (InsSumErr)"
        })
    }
})

router.route('/removeIns').post(async (req, res) => {
    try {
        let userDb = await mongoConnection.getCollection('user')
        // let to_remove = []
        for (const rm of req.body.ids) {
            let accounts = (await userDb.findOne({username: req.username}, {projection: {_id:0, accounts:1}})).accounts
            // accounts.filter(val => bcrypt.compareSync(val, rm))[0]
            let to_remove = accounts.find(val => bcrypt.compareSync(val.access_token, rm))
            if (to_remove) {
                console.log(`To be removed: ${to_remove.access_token}`)
                await userDb.updateOne({username: req.username}, {$pull: {accounts: {access_token: to_remove.access_token}}})
            }
        }
        res.send({success: true})
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
    } catch (_) {
        res.send({
            success: false,
            error: "Internal Server Error (RmErr)"
        })
    }
})

module.exports = router