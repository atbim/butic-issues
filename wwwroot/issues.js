let _viewer
const leveColor = new THREE.Vector4(1, 1, 0, 1)
const moderadoColor = new THREE.Vector4(1, 0.5, 0, 1)
const graveColor = new THREE.Vector4(1, 0, 0, 1)

export const initIssues = async (viewer) => {
  _viewer = viewer
  loadUI()
  const res = await fetch('/api/issues')
  const json = await res.json()
  const issuesDiv = document.getElementById('issues')
  issuesDiv.innerHTML = ''
  const issuesList = document.createElement('ul')
  json.data.forEach((issue) => {
    const issueItem = document.createElement('li')
    issueItem.textContent = `#${issue.number} ${issue.name}`
    const color = getColorHexByStatus(issue.status)
    issueItem.style.color = color
    issueItem.id = issue._id
    issueItem.addEventListener('click', onIssueClick)
    issuesList.appendChild(issueItem)
  })
  issuesDiv.appendChild(issuesList)
}

const loadUI = () => {
  _viewer.addEventListener(Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT, () => {
    const showAll = document.getElementById('showAll')
    const colorByStatus = document.getElementById('colorByStatus')
    showAll.disabled = false
    colorByStatus.hidden = false
    showAll.addEventListener('click', () => {
      _viewer.clearThemingColors()
      _viewer.showAll()
      _viewer.fitToView()
    })
    colorByStatus.addEventListener('click', async () => {
      const res = await fetch('/api/issues/status')
      const json = await res.json()
      let dbIds = []
      json.data.forEach((item) => {
        const status = item._id
        if (status) {
          item.dbIds.forEach((dbId) => {
            dbIds.push(dbId)
            _viewer.setThemingColor(dbId, getColorByStatus(status))
          })
        }
      })
      _viewer.isolate(dbIds)
      _viewer.fitToView(dbIds)
    })
  })
}

const onIssueClick = async (e) => {
  const issueId = e.currentTarget.id
  const res = await fetch(`/api/issues/${issueId}`)
  const json = await res.json()
  const color = getColorByStatus(json.data.status)
  json.data.dbIds.forEach((dbId) => {
    _viewer.setThemingColor(dbId, color)
  })
  _viewer.isolate(json.data.dbIds)
  _viewer.fitToView(json.data.dbIds)
}

const getColorHexByStatus = (status) => {
  switch (status) {
    case 'Leve':
      return '#ffff00'
    case 'Moderado':
      return '#ffa500'
    case 'Grave':
      return '#ff0000'
  }
}

const getColorByStatus = (status) => {
  switch (status) {
    case 'Leve':
      return leveColor
    case 'Moderado':
      return moderadoColor
    case 'Grave':
      return graveColor
  }
}
