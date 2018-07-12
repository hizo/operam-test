const bunyan = require('bunyan')
const fs = require('fs')
const xml2js = require('xml2js')
const slug = require('slug')
const { promisify } = require('util')
const readFileAsync = promisify(fs.readFile)

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

  flatten(data)

  return flattenedArr
}

const loadData = async () => {
  const parser = new xml2js.Parser()
  const parseStringAsync = promisify(parser.parseString)

  try {
    const xmlData = await readFileAsync(__dirname + '/../structure_released.xml')
    const parsedData = await parseStringAsync(xmlData)
    return parsedData
  } catch (err) {
    log.error('!!! There was an error with loading or parsing data !!!')
    return {}
  }
}
;(async () => {
  log.info('=== Starting to load data ===')
  const data = await loadData()
  log.info('=== Loading of data completed ===')

  log.info('=== Starting to linearize data ===')
  const transformedData = transformToLinear(data.ImageNetStructure.synset[0])
  log.info('=== Linearization of data completed ===')
})()
