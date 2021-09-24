import { apiConfiguration } from './templates.js'

window.onload = () => {
  document.querySelector('div.apiConfig').addEventListener('click', handleApiConfigClick)

  const apiPath = findCookie('deconz_api_path') || ''

  renderApiConfig(apiPath)

  const apiConfigDiv = document.querySelector('div.apiConfig')

  if (apiPath) {
    apiConfigDiv.classList.add('hidden')
  }
}

const handleApiConfigClick = (e) => {
  const button = e.target.closest('button')
  e.preventDefault()

  if (!button) return

  if (button.name === 'save') {
    const input = document.querySelector("input[name='api_path']")
    document.cookie = `deconz_api_path=${input.value}`
    console.log('New api path:', input.value)
  }

  if (button.name === 'clear') {
    document.cookie = 'deconz_api_path=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'

    renderApiConfig('')
  }

  if (button.name === 'show') {
    const div = document.querySelector('div.apiConfig')
    div.classList.toggle('hidden')
  }
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
