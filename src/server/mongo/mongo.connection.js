const mongo = require('mongodb').MongoClient // Mongo client
const config = require('./mongo.config')
let db

let getDb = async () => {
    if (!db) {
        let db = (await mongo.connect(config.DBURI+config.DBNAME, {useUnifiedTopology: true})).db()
        // userDb = await db.collection(config.COLLECTION)
        return db
    }

    return db
}

let getCollection = async (collectionName) => {
    return (await getDb()).collection(collectionName)
}

module.exports = {getDb, getCollection}