const { MongoClient } = require('mongodb')
const log = require('debug')('mongo:rs')
const chalk = require('chalk')

module.exports = async url => {
  log('Connecting to node %s', chalk.cyan(url))
  const client = MongoClient(url)

  try {
    await client.connect()

    return client
  } catch (e) {
    console.error(e.stack)
    process.exit(1)
  }
}
