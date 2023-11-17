const express = require('express')
const formidable = require('express-formidable')
const {
  listBuckets,
  createBucket,
  listObjects,
  uploadObject,
  translateObject,
  getManifest,
  urnify,
} = require('../services/aps.js')

let router = express.Router()

router.get('/api/buckets', async (req, res, next) => {
  try {
    const buckets = await listBuckets()
    res.status(200).json(buckets)
  } catch (error) {
    next(error)
  }
})

router.post('/api/buckets', async (req, res, next) => {
  try {
    const bucket = await createBucket(req.body.name.toLocaleLowerCase())
    res.status(200).json({ status: 'success', data: bucket })
  } catch (error) {
    next(error)
  }
})

router.get('/api/models/:bucketKey', async function (req, res, next) {
  try {
    let bucketKey = req.params.bucketKey
    if (bucketKey === '<sinNombre>') {
      bucketKey = process.env.APS_CLIENT_ID.toLowerCase() + '-basic-app'
    } else {
      bucketKey = `${bucketKey}-${process.env.APS_CLIENT_ID.toLowerCase()}-basic-app`
    }
    const objects = await listObjects(bucketKey)
    res.json(
      objects.map((o) => ({
        name: o.objectKey,
        urn: urnify(o.objectId),
      }))
    )
  } catch (err) {
    next(err)
  }
})

router.get('/api/models/:urn/status', async function (req, res, next) {
  try {
    const manifest = await getManifest(req.params.urn)
    if (manifest) {
      let messages = []
      if (manifest.derivatives) {
        for (const derivative of manifest.derivatives) {
          messages = messages.concat(derivative.messages || [])
          if (derivative.children) {
            for (const child of derivative.children) {
              messages.concat(child.messages || [])
            }
          }
        }
      }
      res.json({
        status: manifest.status,
        progress: manifest.progress,
        messages,
      })
    } else {
      res.json({ status: 'n/a' })
    }
  } catch (err) {
    next(err)
  }
})

router.post('/api/models/:bucketKey', formidable(), async function (req, res, next) {
  let bucketKey = req.params.bucketKey
  if (bucketKey === '<sinNombre>') {
    bucketKey = process.env.APS_CLIENT_ID.toLowerCase() + '-basic-app'
  } else {
    bucketKey = `${bucketKey}-${process.env.APS_CLIENT_ID.toLowerCase()}-basic-app`
  }
  console.log('bucketKey: ', bucketKey)
  const file = req.files['model-file']
  if (!file) {
    res.status(400).send('The required field ("model-file") is missing.')
    return
  }
  try {
    console.log('voy a subir el fichero')
    const obj = await uploadObject(bucketKey, file.name, file.path)
    console.log('obj: ', obj)
    await translateObject(
      urnify(obj.objectId),
      req.fields['model-zip-entrypoint']
    )
    console.log('fichero transformado')
    res.json({
      name: obj.objectKey,
      urn: urnify(obj.objectId),
    })
  } catch (err) {
    next(err)
  }
})

module.exports = router
