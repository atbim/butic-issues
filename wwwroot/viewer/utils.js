const getAllLeafComponents = (viewer, callback) => {
  var cbCount = 0 // count pending callbacks
  var components = [] // store the results
  var tree // the instance tree

  const getLeafComponentsRec = (parent) => {
    cbCount++
    if (tree.getChildCount(parent) != 0) {
      tree.enumNodeChildren(
        parent,
        (children) => {
          getLeafComponentsRec(children)
        },
        false
      )
    } else {
      components.push(parent)
    }
    if (--cbCount == 0) callback(components)
  }
  viewer.getObjectTree((objectTree) => {
    tree = objectTree
    var allLeafComponents = getLeafComponentsRec(tree.getRootId())
  })
}

export const getAllLeafComponentsAsync = (viewer) => {
    return new Promise((resolve, reject) => {
        getAllLeafComponents(viewer, dbIds => {
            resolve(dbIds)
        })
    })
}

