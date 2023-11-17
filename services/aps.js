const fs = require('fs')
const APS = require('forge-apis')
const { APS_CLIENT_ID, APS_CLIENT_SECRET, APS_BUCKET } = require('../config.js')

let internalAuthClient = new APS.AuthClientTwoLegged(
  APS_CLIENT_ID,
  APS_CLIENT_SECRET,
  ['bucket:read', 'bucket:create', 'data:read', 'data:write', 'data:create'],
  true
)
let publicAuthClient = new APS.AuthClientTwoLegged(
  APS_CLIENT_ID,
  APS_CLIENT_SECRET,
  ['viewables:read'],
  true
)

const service = (module.exports = {})

service.getInternalToken = async () => {
  if (!internalAuthClient.isAuthorized()) {
    await internalAuthClient.authenticate()
  }
  return internalAuthClient.getCredentials()
}

service.getPublicToken = async () => {
  if (!publicAuthClient.isAuthorized()) {
    await publicAuthClient.authenticate()
  }
  return publicAuthClient.getCredentials()
}

service.ensureBucketExists = async (bucketKey) => {
  try {
    await new APS.BucketsApi().getBucketDetails(
      bucketKey,
      null,
      await service.getInternalToken()
    )
  } catch (err) {
    if (err.response.status === 404) {
      await new APS.BucketsApi().createBucket(
        { bucketKey, policyKey: 'persistent' },
        {},
        null,
        await service.getInternalToken()
      )
    } else {
      throw err
    }
  }
}

service.listBuckets = async () => {
  const res = await new APS.BucketsApi().getBuckets(
    {},
    null,
    await service.getInternalToken()
  )
  const buckets = res.body.items.map((bucket) => {
    let name = bucket.bucketKey.split('-')[0]
    if (name === process.env.APS_CLIENT_ID.toLowerCase()) {
      name = '<sinNombre>'
    }
    return name
  })

  return buckets
}

service.createBucket = async (name) => {
  const res = await new APS.BucketsApi().createBucket(
    {
      bucketKey: `${name}-${process.env.APS_CLIENT_ID.toLocaleLowerCase()}-basic-app`,
      policyKey: 'persistent',
    },
    {},
    null,
    await service.getInternalToken()
  )

  return res.body
}

service.listObjects = async (bucketKey) => {
  await service.ensureBucketExists(bucketKey)
  let resp = await new APS.ObjectsApi().getObjects(
    bucketKey,
    { limit: 64 },
    null,
    await service.getInternalToken()
  )
  let objects = resp.body.items
  while (resp.body.next) {
    const startAt = new URL(resp.body.next).searchParams.get('startAt')
    resp = await new APS.ObjectsApi().getObjects(
      bucketKey,
      { limit: 64, startAt },
      null,
      await service.getInternalToken()
    )
    objects = objects.concat(resp.body.items)
  }
  return objects
}

service.uploadObject = async (objectName, filePath) => {
  await service.ensureBucketExists(APS_BUCKET)
  const buffer = await fs.promises.readFile(filePath)
  const results = await new APS.ObjectsApi().uploadResources(
    APS_BUCKET,
    [{ objectKey: objectName, data: buffer }],
    { useAcceleration: false, minutesExpiration: 15 },
    null,
    await service.getInternalToken()
  )
  if (results[0].error) {
    throw results[0].completed
  } else {
    return results[0].completed
  }
}

service.translateObject = async (urn, rootFilename) => {
  const job = {
    input: { urn },
    output: { formats: [{ type: 'svf', views: ['2d', '3d'] }] },
  }
  if (rootFilename) {
    job.input.compressedUrn = true
    job.input.rootFilename = rootFilename
  }
  const resp = await new APS.DerivativesApi().translate(
    job,
    {},
    null,
    await service.getInternalToken()
  )
  return resp.body
}

service.getManifest = async (urn) => {
  try {
    const resp = await new APS.DerivativesApi().getManifest(
      urn,
      {},
      null,
      await service.getInternalToken()
    )
    return resp.body
  } catch (err) {
    if (err.response.status === 404) {
      return null
    } else {
      throw err
    }
  }
}

service.urnify = (id) => Buffer.from(id).toString('base64').replace(/=/g, '')
