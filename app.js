import { ApiConfiguration } from './configuration.js'
import { Lights } from './lights.js'

let apiPath

let globalData = {
  lights: []
}

window.onload = () => {
  ApiConfiguration.init(updateApiPath)
  Lights.init(deconzPut, globalData)

  apiPath = findCookie('deconz_api_path') || ''

  getElements()
  setInterval(getElements, 5000)

  render()
}

const updateApiPath = (path) => {
  apiPath = path
  if (!path) {
    document.cookie = 'deconz_api_path=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
  } else {
    document.cookie = `deconz_api_path=${path}`
  }
  render()
}

const getElements = async () => {
  if (!apiPath) return

  const result = await fetch(apiPath)

  if (!result.ok) {
    throw 'Api reponse not ok'
  }

  const data = await result.json()

  globalData.lights = mapToList(data.lights)

  Lights.render()
}

const deconzPut = async (path, payload) => {
  const url = apiPath + path

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
}

const render = () => {
  ApiConfiguration.render(apiPath)

  Lights.render()
}

const findCookie = (name) => {
  const match = document.cookie
    .split(';')
    .map((a) => a.split('='))
    .map(([key, value]) => ({ key: key.trim(), value }))
    .find((c) => c.key === name)

  if (!match || !match.value || match.value === '') return undefined

  return match.value
}

const mapToList = (uglyList) => Object.entries(uglyList).map(([id, params]) => ({ id, ...params }))
