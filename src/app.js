import { ApiConfiguration } from './configuration.js'
import { Lights } from './lights.js'

let globalData = {
  lights: []
}

window.onload = () => {
  ApiConfiguration.init(apiPathIsChangedCallback)
  Lights.init(deconzPut, globalData)

  getElements()
  setInterval(getElements, 5000)

  render()
}

const apiPathIsChangedCallback = () => {
  getElements()
  render()
}

const getElements = async () => {
  const apiPath = ApiConfiguration.config.apiPath
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
  const url = ApiConfiguration.config.apiPath + path

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
}

const render = () => {
  ApiConfiguration.render()

  Lights.render()
}

const mapToList = (uglyList) => Object.entries(uglyList).map(([id, params]) => ({ id, ...params }))
