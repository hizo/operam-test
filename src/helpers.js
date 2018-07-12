const MongoClient = require('mongodb').MongoClient
const { promisify } = require('util')
const config = require('./config')

const connectToDatabase = async () => {
  const connectAsync = promisify(MongoClient.connect)

  try {
    const client = await connectAsync(config.databaseUrl, { useNewUrlParser: true })
    const db = client.db(config.databaseName)
    return { client, db }
  } catch (err) {
    log.error('Error while connecting to database.', err)
  }
}

module.exports = {
  connectToDatabase,
}
