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
    bucketItem.addEventListener('click', onBucketClick)
    bucketsList.appendChild(bucketItem)
  })
  bucketsDiv.appendChild(bucketsList)
}

const onBucketClick = async (e) => {
  const bucketId = e.currentTarget.id
  const res = await fetch(`/api/models/${bucketId}`)
  const json = await res.json()
  const uploadButton = document.getElementById('upload')
  uploadButton.hidden = false
  const modelsDiv = document.getElementById('models')
  modelsDiv.innerHTML = ''
  if (json.length > 0) {
    const modelsList = document.createElement('ul')
    json.forEach((model) => {
      const modelItem = document.createElement('li')
      modelItem.textContent = model.name
      modelItem.id = model.urn
      modelItem.addEventListener('click', onModelClick)
      modelsList.appendChild(modelItem)
    })
    modelsDiv.appendChild(modelsList)
  } else {
    modelsDiv.appendChild(
      document.createTextNode(
        'El bucket seleccionado no tiene modelos. Añade uno con el botón de Upload 🚀'
      )
    )
  }
}

const onModelClick = (e) => {
  const urn = e.currentTarget.id
  window.location.href = '/?urn=' + urn
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
