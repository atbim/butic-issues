import { initViewer, loadModel } from './viewer.js'

const miPrimeraFuncion = async () => {
  const button = document.getElementById('myFirstButton')
  const resetButton = document.getElementById('resetButton')
  const getIssuesButton = document.getElementById('getIssuesButton')
  button.addEventListener('click', onButtonClick)
  resetButton.addEventListener('click', onResetClick)
  
  const res = await fetch('/api/issues')
    const json = await res.json()
    const issuesDiv = document.getElementById('issues')
    issuesDiv.innerHTML = ''
    const issuesList = document.createElement('ul')
    json.data.forEach(issue => {
      const issueItem = document.createElement('li')
      issueItem.textContent = issue.name
      issueItem.id = issue._id
      issueItem.addEventListener('click', (e) => {
        const issueId = e.currentTarget.id
        alert(`Has clicado en el Issue: ${issueId}`)
        NOP_VIEWER.select([2213, 2590])
      })
      issuesList.appendChild(issueItem)
    })
    issuesDiv.appendChild(issuesList)
}

const onButtonClick = () => {
  const red = new THREE.Vector4(1, 0, 0, 1)
  const query = document.getElementById('query')
  NOP_VIEWER.search(query.value, (dbIds) => {
    NOP_VIEWER.isolate(dbIds)
    NOP_VIEWER.fitToView(dbIds)
    NOP_VIEWER.model.getBulkProperties(
      dbIds,
      ['Length', 'Area', 'Volume'],
      (res) => {
        let suma = {
          count: res.length,
          length: 0.0,
          area: 0.0,
          volume: 0.0,
        }
        res.forEach((item) => {
          const length = item.properties.find((x) => x.displayName === 'Length')
          if (length) {
            suma.length += length.displayValue
          }
          const area = item.properties.find((x) => x.displayName === 'Area')
          if (area) {
            suma.area += area.displayValue
          }
          const volume = item.properties.find((x) => x.displayName === 'Volume')
          if (volume) {
            suma.volume += volume.displayValue
          }
        })
        const textoArea = document.getElementById('textoArea')
        textoArea.textContent = `El sumatorio de Área de la búsqueda es ${suma.area.toFixed(
          2
        )} m2.`
        console.log(suma)
      }
    )
  })
}

const onResetClick = () => {
  NOP_VIEWER.showAll()
  NOP_VIEWER.fitToView()
}

miPrimeraFuncion()

initViewer(document.getElementById('preview')).then((viewer) => {
  const urn = window.location.hash?.substring(1)
  setupModelSelection(viewer, urn)
  setupModelUpload(viewer)
})

async function setupModelSelection(viewer, selectedUrn) {
  const dropdown = document.getElementById('models')
  dropdown.innerHTML = ''
  try {
    const resp = await fetch('/api/models')
    if (!resp.ok) {
      throw new Error(await resp.text())
    }
    const models = await resp.json()
    dropdown.innerHTML = models
      .map(
        (model) =>
          `<option value=${model.urn} ${
            model.urn === selectedUrn ? 'selected' : ''
          }>${model.name}</option>`
      )
      .join('\n')
    dropdown.onchange = () => onModelSelected(viewer, dropdown.value)
    if (dropdown.value) {
      onModelSelected(viewer, dropdown.value)
    }
  } catch (err) {
    alert('Could not list models. See the console for more details.')
    console.error(err)
  }
}

async function setupModelUpload(viewer) {
  const upload = document.getElementById('upload')
  const input = document.getElementById('input')
  const models = document.getElementById('models')
  upload.onclick = () => input.click()
  input.onchange = async () => {
    const file = input.files[0]
    let data = new FormData()
    data.append('model-file', file)
    if (file.name.endsWith('.zip')) {
      // When uploading a zip file, ask for the main design file in the archive
      const entrypoint = window.prompt(
        'Please enter the filename of the main design inside the archive.'
      )
      data.append('model-zip-entrypoint', entrypoint)
    }
    upload.setAttribute('disabled', 'true')
    models.setAttribute('disabled', 'true')
    showNotification(
      `Uploading model <em>${file.name}</em>. Do not reload the page.`
    )
    try {
      const resp = await fetch('/api/models', { method: 'POST', body: data })
      if (!resp.ok) {
        throw new Error(await resp.text())
      }
      const model = await resp.json()
      setupModelSelection(viewer, model.urn)
    } catch (err) {
      alert(
        `Could not upload model ${file.name}. See the console for more details.`
      )
      console.error(err)
    } finally {
      clearNotification()
      upload.removeAttribute('disabled')
      models.removeAttribute('disabled')
      input.value = ''
    }
  }
}

async function onModelSelected(viewer, urn) {
  if (window.onModelSelectedTimeout) {
    clearTimeout(window.onModelSelectedTimeout)
    delete window.onModelSelectedTimeout
  }
  window.location.hash = urn
  try {
    const resp = await fetch(`/api/models/${urn}/status`)
    if (!resp.ok) {
      throw new Error(await resp.text())
    }
    const status = await resp.json()
    switch (status.status) {
      case 'n/a':
        showNotification(`Model has not been translated.`)
        break
      case 'inprogress':
        showNotification(`Model is being translated (${status.progress})...`)
        window.onModelSelectedTimeout = setTimeout(
          onModelSelected,
          5000,
          viewer,
          urn
        )
        break
      case 'failed':
        showNotification(
          `Translation failed. <ul>${status.messages
            .map((msg) => `<li>${JSON.stringify(msg)}</li>`)
            .join('')}</ul>`
        )
        break
      default:
        clearNotification()
        loadModel(viewer, urn)
        break
    }
  } catch (err) {
    alert('Could not load model. See the console for more details.')
    console.error(err)
  }
}

function showNotification(message) {
  const overlay = document.getElementById('overlay')
  overlay.innerHTML = `<div class="notification">${message}</div>`
  overlay.style.display = 'flex'
}

function clearNotification() {
  const overlay = document.getElementById('overlay')
  overlay.innerHTML = ''
  overlay.style.display = 'none'
}
