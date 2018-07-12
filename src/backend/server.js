// const enhanceNode = node => {
//   const categories = node.name.split('>')
//   const name = categories.pop().trim()
//   const id = slug(name)
//   const parentId = categories.length > 0 ? slug(categories.pop()) : 'rootNode'

//   return {
//     ...node,
//     name,
//     id,
//     parentId,
//   }
// }

// const listToTree = list => {
//   const listCopy = [...list] // make a copy of the list, so we don't mutate original data
//   const map = {}
//   let root
//   let node

//   for (let i = 0, len = listCopy.length; i < len; i++) {
//     node = listCopy[i] = enhanceNode(listCopy[i])
//     map[node.id] = i
//     node.children = []
//     if (node.parentId !== 'rootNode') {
//       listCopy[map[node.parentId]].children.push(node)
//     } else {
//       root = node
//     }
//   }

//   return root
// }
