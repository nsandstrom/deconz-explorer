import { ApiConfiguration } from './configuration.js'


const getElements = async () => {
  const apiPath = ApiConfiguration.config.apiPath
  if (!apiPath) return

  const result = await fetch(apiPath)

  if (!result.ok) {
    throw 'Api reponse not ok'
  }

  const data = await result.json()

  return data
}

const put = async (path, payload) => {
  const url = ApiConfiguration.config.apiPath + path

  const result = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })

  if (!result.ok) {
    throw 'Api reponse not ok'
  }

  const data = await result.json()

  return data
}

const Deconz = { getElements, put }

export { Deconz }
