const init = () => {
  const bucketForm = document.getElementById('createBucket')
  bucketForm.addEventListener('click', onFormSubmit)
  listBuckets()
}

const listBuckets = async () => {
  const res = await fetch('/api/buckets')
  const json = await res.json()
  const buckets = document.getElementById('buckets')
  buckets.innerHTML = ''
  const initOption = document.createElement('option')
  initOption.selected = true
  initOption.disabled = true
  initOption.textContent = 'Elige un bucket'
  buckets.appendChild(initOption)
  json.forEach((bucket) => {
    const bucketElement = document.createElement('option')
    bucketElement.value = bucket
    bucketElement.textContent = bucket
    buckets.appendChild(bucketElement)
  })
  buckets.addEventListener('change', onBucketSelect)
}

const onBucketSelect = async (e) => {
  const bucketId = e.currentTarget.value
  const res = await fetch(`/api/models/${bucketId}`)
  const json = await res.json()
  const cardContainer = document.getElementById('cardContainer')

  // Limpia el contenedor antes de agregar nuevos cards
  cardContainer.innerHTML = ''
  const cardRow = document.createElement('div')
  cardRow.className = 'd-flex flex-row'
  const input = document.getElementById('input')
  input.hidden = false
  // Construye y agrega los cards dinámicamente
  json.forEach((cardData) => {
    const card = document.createElement('div')
    card.className = 'card'
    card.className = 'card m-3'
    card.style = 'width: 18rem;'

    const cardImg = document.createElement('img')
    cardImg.className = 'card-img-top'
    cardImg.src = 'data:image/png;base64,' + cardData.thumbnail
    cardImg.alt = 'Card image cap'

    const cardBody = document.createElement('div')
    cardBody.className = 'card-body'

    const cardTitle = document.createElement('h5')
    cardTitle.className = 'card-title'
    cardTitle.textContent = cardData.name

    const cardLink = document.createElement('a')
    cardLink.href = '/viewer?urn=' + cardData.urn
    cardLink.className = 'btn btn-primary'
    cardLink.textContent = 'Go to Viewer'

    // Agrega elementos al cardBody
    cardBody.appendChild(cardTitle)
    cardBody.appendChild(cardLink)

    // Agrega elementos al card
    card.appendChild(cardImg)
    card.appendChild(cardBody)

    // Agrega el card al contenedor
    cardRow.appendChild(card)
  })
  cardContainer.appendChild(cardRow)

  input.onchange = async () => {
    const file = input.files[0]
    let data = new FormData()
    data.append('model-file', file)
    try {
      console.log('bucketId: ', bucketId)
      const resp = await fetch(`/api/models/${bucketId}`, {
        method: 'POST',
        body: data,
      })
      if (!resp.ok) {
        throw new Error(await resp.text())
      }
      const model = await resp.json()
      console.log('model: ', model)
    } catch (error) {
      alert(
        `Could not upload model ${file.name}. See the console for more details.`
      )
      console.error(err)
    } finally {
      input.value = ''
    }
  }
}

const onModelClick = (e) => {
  const urn = e.currentTarget.id
  window.location.href = '/viewer?urn=' + urn
}

const onFormSubmit = async () => {
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

  console.log('res: ', res)

  listBuckets()
}

init()
