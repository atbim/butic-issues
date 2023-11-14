let _viewer

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
    issueItem.textContent = issue.name
    issueItem.id = issue._id
    issueItem.addEventListener('click', onIssueClick)
    issuesList.appendChild(issueItem)
  })
  issuesDiv.appendChild(issuesList)
}

const loadUI = () => {
  const showAll = document.getElementById('showAll')
  showAll.addEventListener('click', () => {
    _viewer.showAll()
    _viewer.fitToView()
  })
}

const onIssueClick = async (e) => {
  const issueId = e.currentTarget.id
  const resIssue = await fetch(`/api/issues/${issueId}`)
  const jsonIssue = await resIssue.json()
  _viewer.isolate(jsonIssue.data.dbIds)
  _viewer.fitToView(jsonIssue.data.dbIds)
}
