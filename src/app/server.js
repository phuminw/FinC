/**
 * Import
 */

const express = require('express')
const { exit } = require('process')
const bodyParser = require('body-parser')
const cors = require('cors')
const plaid = require('plaid')
const mongo = require('mongodb').MongoClient // Mongo client
const key = require("../../plaid/key.json") // Client key

const app = express() // Express
const plaidClient = new plaid.Client(key.client_id, key.secret, key.public_key, plaid.environments.sandbox) // Plaid client
const DBURI = "mongodb://localhost:27017/"
const DBNAME = "FinC"
const COLLECTION = "user"
let db
let userDb

/* Begin DB connection section */

mongo.connect(DBURI+DBNAME, {useUnifiedTopology: true})
.then(res => {db = res.db()
    if (db === undefined) {
        console.error('db connection failed')
        exit(-1)
    }

    userDb = db.collection(COLLECTION)
})
.catch(err => {console.error("Mongo connection failed");exit(-1)})

/* End DB connection section */

app.use(cors())
app.use(bodyParser.urlencoded({extended: true})) // Body parser middleware
app.use(bodyParser.json())

/* Plaid: Handle Plaid public token from user */
app.route('/api/plaid/plaidPTHandler').post((req, res) => {
    console.log(`Got public token in the back-end`)
    plaidClient.exchangePublicToken(req.body.publictoken)
    .then((tokenResponse) => {
        let accessToken = tokenResponse.access_token
        userDb.updateOne({username: req.body.username}, {$addToSet:{
            accounts: tokenResponse.access_token
        }})
        console.log(`Added ${tokenResponse.access_token} to mongo from server`)
        res.send({success: true})
    })
    .catch(err => {
        console.error("Access token exchange error: " + err)
        res.send({success: false})
    })
})

/* Plaid: Query accounts information */
app.route('/api/plaid/getAccountsInfo').get((req, res) => {
    console.log("Account info queried")
    plaidClient.getAccounts(req.query.accessToken)
    .then(accResponse => {
        // Query institution name and response
        plaidClient.getInstitutionById(accResponse.item.institution_id)
        .then(insResponse => {
            res.send({
                success: true,
                insName: insResponse.institution.name,
                accounts: accResponse.accounts
            })
        })
        .catch(err => {
            console.error('Error querying institution name ' + err)
        })
    })
    .catch(err => {
        console.error('Error getting account information ' + err)
        res.send({success: false})
    })
})

/* Mongo: Accounts query: get all accounts access token from db */
app.route('/api/db/getAccounts').get((req, res) => {
    console.log("Got getAccounts query")
    userDb.find({username: req.query.username}, {projection:{_id:0, accounts:1}}).toArray((err, items) => {
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

app.route('/api/db/removeAccount').post((req, res) => {
    console.log(req.body)
    console.log(`Express removing ${req.body.accessToken} from ${req.body.username}`)
    userDb.updateOne({username: req.body.username}, {$pull: {accounts: req.body.accessToken}})
    .then(updateRes => {
        if (updateRes.result.ok && updateRes.result.nModified > 0)
            res.send({success: true})
        else
            res.send({success: false})
    })
    .catch(err => {
        res.send({success: false})
    })
})

app.listen(4500, () => {console.log("Express listened")})