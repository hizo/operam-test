const express = require('express')
const bunyan = require('bunyan')
const slug = require('slug')
const { connectToDatabase } = require('./helpers')
const config = require('./config')

const log = bunyan.createLogger({
  name: 'operam-test',
  stream: process.stdout,
  level: 'trace',
})

const app = express()

const enhanceNode = node => {
  const categories = node.name.split('>')
  const name = categories.pop().trim()
  const id = slug(name)
  const parentId = categories.length > 0 ? slug(categories.pop()) : 'rootNode'

  return {
    ...node,
    name,
    id,
    parentId,
  }
}

const listToTree = list => {
  const listCopy = [...list] // make a copy of the list, so we don't mutate original data
  const map = {}
  let root
  let node

  for (let i = 0, len = listCopy.length; i < len; i++) {
    node = listCopy[i] = enhanceNode(listCopy[i])
    map[node.id] = i
    node.children = []
    if (node.parentId !== 'rootNode') {
      listCopy[map[node.parentId]].children.push(node)
    } else {
      root = node
    }
  }

  return root
}

app.get('*', (req, res, next) => {
  log.info(`Serving ${req.method} ${req.url}`)
  next()
})

app.get('/data', async (req, res) => {
  const { client, db } = await connectToDatabase()
  const collection = db.collection('tuples')
  result = await collection.find({}).toArray()
  client.close()

  res.json(listToTree(result))
})

app.listen(config.backendPort, () => {
  log.info(`Server is running on port ${config.backendPort}`)
})
