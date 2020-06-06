const express = require('express')
const router = express.Router()

const plaid = require('plaid')
const key = require("./key.json") // Client key
const plaidClient = new plaid.Client(key.client_id, key.secret, key.public_key, plaid.environments.sandbox) // Plaid client


/* Plaid: Handle Plaid public token from user */
router.route('/plaidPTHandler').post((req, res) => {
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
router.route('/getAccountsInfo').get((req, res) => {
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

module.exports = router
