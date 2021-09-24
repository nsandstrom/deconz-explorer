import { ApiConfiguration } from './configuration.js'

let apiPath
let elements = []

window.onload = () => {
  ApiConfiguration.init(updateApiPath)

  apiPath = findCookie('deconz_api_path') || ''

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

const render = () => {
  const apiConfigDiv = document.querySelector('div.apiConfig')

  ApiConfiguration.render(apiPath)
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
