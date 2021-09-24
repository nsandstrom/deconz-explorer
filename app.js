import { apiConfiguration } from './templates.js'

let apiPath
let elements = []

window.onload = () => {
  document.querySelector('div.apiConfig').addEventListener('click', (e) => handleApiConfigClick(e, updateApiPath))

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

const handleApiConfigClick = (e, updateApiPath) => {
  const button = e.target.closest('button')
  e.preventDefault()

  if (!button) return

  if (button.name === 'save') {
    const input = document.querySelector("input[name='api_path']")
    apiPath = input.value
    console.log('New api path:', input.value)
    render()
  }

  if (button.name === 'clear') {
    updateApiPath('')
  }

  if (button.name === 'show') {
    const div = document.querySelector('div.apiConfig')
    div.classList.toggle('hidden')
  }
}
const render = () => {
  console.log('Rerender with path:', apiPath)
  const apiConfigDiv = document.querySelector('div.apiConfig')

  if (apiPath) {
    apiConfigDiv.classList.add('hidden')
  }
  renderApiConfig(apiPath)
}

const renderApiConfig = (path) => {
  const params = { path }

  const div = document.querySelector('div.apiConfig')
  div.innerHTML = apiConfiguration(params)
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
