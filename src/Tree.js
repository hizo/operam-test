import React from 'react'
import SortableTree from 'react-sortable-tree'
import FileExplorerTheme from 'react-sortable-tree-theme-file-explorer'
import 'react-sortable-tree/style.css'

const Tree = ({ data, searchQuery, onChange }) => (
  <div style={{ height: window.innerHeight }}>
    <SortableTree
      treeData={data}
      onChange={onChange}
      canDrag={false}
      searchQuery={searchQuery}
      expandOnlySearchedNodes
      theme={FileExplorerTheme}
      generateNodeProps={({ node }) => ({
        title: `${node.name} - (${node.size})`,
        expanded: 'true',
      })}
    />
  </div>
)

export default Tree
