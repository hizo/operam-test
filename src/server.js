const express = require('express')
const cors = require('cors')
const slug = require('slug')
const { connectToDatabase, createLogger } = require('./helpers')
const config = require('./config')

const log = createLogger()
const app = express()

app.use(cors())

const enhanceNode = node => {
  const categories = node.name.split('>')
  const name = categories.pop()
  const parentName = categories.length > 0 ? categories.pop() : 'rootNode'
  const id = slug(name)
  const parentId = slug(parentName)

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
