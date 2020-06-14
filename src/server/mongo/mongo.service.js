const mongo = require('mongodb').MongoClient // Mongo client
const config = require('./mongo.config')
const { exit } = require('process')

const db = {}
// let db
// let userDb

/* Begin DB connection section */

mongo.connect(config.DBURI+config.DBNAME, {useUnifiedTopology: true})
.then(res => {
    db.db = res.db()

    if (db === undefined) {
        console.error('db connection failed')
        exit(-1)
    }

    db.userDb = db.db.collection(config.COLLECTION)
})
.catch(err => {console.error(`Mongo connection failed ${err}`);exit(-1)})

/* End DB connection section */

module.exports = db