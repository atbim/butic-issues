const init = () => {
  const bucketForm = document.getElementById('createBucket')
  bucketForm.addEventListener('submit', onFormSubmit)

  listBuckets()
}

const listBuckets = async () => {
  const res = await fetch('/api/buckets')
  const json = await res.json()
  const bucketsDiv = document.getElementById('buckets')
  bucketsDiv.innerHTML = ''
  const bucketsList = document.createElement('ul')
  json.forEach((bucket) => {
    const bucketItem = document.createElement('li')
    bucketItem.textContent = bucket
    bucketItem.id = bucket
    bucketItem.addEventListener('click', () => {})
    bucketsList.appendChild(bucketItem)
  })
  bucketsDiv.appendChild(bucketsList)
}

const onFormSubmit = async (e) => {
  e.preventDefault()
  const bucketName = document.getElementById('bucketName').value
  const body = {
    name: bucketName,
  }
  const res = await fetch('/api/buckets', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  listBuckets()
}

init()
