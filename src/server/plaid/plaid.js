const express = require('express')
const router = express.Router()

const mongoConnection = require('../mongo/mongo.connection')

const plaid = require('plaid')
// const key = require("./key") // Client key
const key = {
    client_id: process.env.PLAID_CLIENT_ID,
    secret: process.env.PLAID_SECRET,
    public_key: process.env.PLAID_PUBLIC_KEY
}
const plaidClient = new plaid.Client({clientID: key.client_id, secret: key.secret, publicKey: key.public_key, env: plaid.environments.sandbox}) // Plaid client

const bcrypt = require('bcrypt')
const SALTROUNDS = 10

/* Plaid: Handle Plaid public token from user */
router.route('/plaidPTHandler').post(async (req, res) => {
    try {
        let tokenResponse = await plaidClient.exchangePublicToken(req.body.publictoken)
        let userDb = await mongoConnection.getCollection('user')

        userDb.updateOne({username: req.username}, {$addToSet:{accounts: {
            institution_name:  (await plaidClient.getInstitutionById((await plaidClient.getAccounts(tokenResponse.access_token)).item.institution_id)).institution.name,
            access_token: tokenResponse.access_token
        }}})

        res.send({success: true})
    } catch (err) {
        res.send({success: false, error: "Internal Server Error (PPTH)"})
    }
})

/**
 * Query all accounts of the given institution's Plaid access token
 * 
 * @param {string} access_token institution's Plaid access token
 * @return {Promise<{institution_name: string, accounts: Account[]}>} Promise resolving to institution's name and accounts
 */

const getAccountInfo = async account => {
    // let response = 
    return {
        institution_name: account.institution_name,
        accounts: (await plaidClient.getAccounts(account.access_token)).accounts
        // id: bcrypt.hashSync(account.access_token, SALTROUNDS)
    }
}

// /* Plaid: Query accounts information */
// router.route('/getAccountsInfo').get((req, res) => {
//     console.log("Account info queried")
//     plaidClient.getAccounts(req.query.accessToken)
//     .then(accResponse => {
//         // Query institution name and response
//         plaidClient.getInstitutionById(accResponse.item.institution_id)
//         .then(insResponse => {
//             res.send({
//                 success: true,
//                 insName: insResponse.institution.name,
//                 accounts: accResponse.accounts
//             })
//         })
//         .catch(err => {
//             console.error('Error querying institution name ' + err)
//         })
//     })
//     .catch(err => {
//         console.error('Error getting account information ' + err)
//         res.send({success: false})
//     })
// })

module.exports = {router, getAccountInfo}
