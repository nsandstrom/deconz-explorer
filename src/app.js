import { ApiConfiguration } from './configuration.js'
import { Deconz } from './deconz.js'
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
  const data = await Deconz.getElements()

  globalData.lights = mapToList(data.lights)

  Lights.render()
}

const deconzPut = async (path, payload) => {
  await Deconz.put(path, payload)
}

const render = () => {
  ApiConfiguration.render()

  Lights.render()
}

const mapToList = (uglyList) => Object.entries(uglyList).map(([id, params]) => ({ id, ...params }))
