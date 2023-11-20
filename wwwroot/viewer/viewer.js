/// import * as Autodesk from "@types/forge-viewer";

async function getAccessToken(callback) {
  try {
    const resp = await fetch('/api/auth/token')
    if (!resp.ok) {
      throw new Error(await resp.text())
    }
    const { access_token, expires_in } = await resp.json()
    callback(access_token, expires_in)
  } catch (err) {
    alert('Could not obtain access token. See the console for more details.')
    console.error(err)
  }
}

export function initViewer(container) {
  return new Promise(function (resolve, reject) {
    Autodesk.Viewing.Initializer({ getAccessToken }, function () {
      const config = {
        extensions: ['Autodesk.DocumentBrowser'],
      }
      const viewer = new Autodesk.Viewing.GuiViewer3D(container, config)
      viewer.start()
      viewer.setTheme('light-theme')
      resolve(viewer)
    })
  })
}

export function loadModel(viewer, urn, is2d) {
  return new Promise(function (resolve, reject) {
    function onDocumentLoadSuccess(doc) {
      const root = doc.getRoot()
      console.log('root: ', root)
      let node = root.getDefaultGeometry()
      if (is2d) {
        doc.downloadAecModelData((res) => console.log('aecdata: ', res))
        const nodes2d = root.getSheetNodes()
        const dropdown = document.getElementById('nodes2d')
        dropdown.innerHTML = nodes2d
          .map(
            (node2d) =>
              `<option value=${node2d.data.guid}>${node2d.data.name}</option>`
          )
          .join('\n')
        dropdown.addEventListener('change', (e) => {
          const guid = e.currentTarget.value
          const actualNode = viewer.model.getDocumentNode()
          //viewer.unloadDocumentNode(actualNode)
          const newNode = root.findByGuid(guid)
          viewer.loadDocumentNode(doc, newNode)
        })
        node = nodes2d[0]
        console.log('node: ', node)
      }
      resolve(viewer.loadDocumentNode(doc, node))
    }
    function onDocumentLoadFailure(code, message, errors) {
      reject({ code, message, errors })
    }
    viewer.setLightPreset(0)
    Autodesk.Viewing.Document.load(
      'urn:' + urn,
      onDocumentLoadSuccess,
      onDocumentLoadFailure
    )
  })
}
