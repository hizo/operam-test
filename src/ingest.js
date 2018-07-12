const bunyan = require('bunyan')
const fs = require('fs')
const xml2js = require('xml2js')
const { promisify } = require('util')
const readFileAsync = promisify(fs.readFile)
const { connectToDatabase } = require('./helpers')

const log = bunyan.createLogger({
  name: 'operam-test',
  stream: process.stdout,
  level: 'trace',
})

const transformToLinear = data => {
  const flattenedArr = []

  const flatten = (node, parent = {}) => {
    const name = parent.name ? `${parent.name} > ${node.$.words}` : node.$.words
    const result = { name, size: 0 }
    flattenedArr.push(result)

    if (!node.synset) {
      return result
    }

    result.size += node.synset.length

    node.synset.forEach(synset => {
      const childResult = flatten(synset, result)
      result.size += childResult.size
    })

    return result
  }

  log.info('=== Starting to linearize data ===')
  flatten(data)
  log.info('=== Linearization of data completed ===')

  return flattenedArr
}

const loadData = async () => {
  const parser = new xml2js.Parser()
  const parseStringAsync = promisify(parser.parseString)

  try {
    log.info('=== Starting to load data ===')
    const xmlData = await readFileAsync(__dirname + '/../structure_released.xml')
    const parsedData = await parseStringAsync(xmlData)
    log.info('=== Loading of data completed ===')
    return parsedData
  } catch (err) {
    log.error('!!! There was an error with loading or parsing data !!!')
    return {}
  }
}

const saveToDb = async data => {
  log.info('=== Saving to database ===')
  const { client, db } = await connectToDatabase()
  const collection = db.collection('tuples')

  try {
    // await collection.insertMany(data)
    log.info('=== Saving to database completed ===')
    client.close()
  } catch (err) {
    log.error('Error while saving to database.', err)
  }
}
;(async () => {
  const data = await loadData()
  const transformedData = transformToLinear(data.ImageNetStructure.synset[0])
  await saveToDb(transformedData)
  log.info('=== Data ingestion completed ===')
})()
