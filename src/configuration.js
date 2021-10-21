// This module handles all configuration for the app
// *Api path

const _config = { apiPath: '' }

const init = (apiPathIsChangedCallback) => {
  document
    .querySelector('div.apiConfig')
    .addEventListener('click', (e) => handleApiConfigClick(e, apiPathIsChangedCallback))

  _config.apiPath = findCookie('deconz_api_path') || ''
}

const handleApiConfigClick = (e, apiPathIsChangedCallback) => {
  const button = e.target.closest('button')
  e.preventDefault()

  if (!button) return

  if (button.name === 'save') {
    const input = document.querySelector("input[name='api_path']")
    updateApiPath(input.value, apiPathIsChangedCallback)
  }

  if (button.name === 'clear') {
    updateApiPath('', apiPathIsChangedCallback)
  }

  if (button.name === 'show') {
    const div = document.querySelector('div.apiConfig')
    div.classList.toggle('hidden')
  }
}

const updateApiPath = (path, apiPathIsChangedCallback) => {
  _config.apiPath = path
  if (!path) {
    document.cookie = 'deconz_api_path=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
  } else {
    document.cookie = `deconz_api_path=${path}`
  }
  apiPathIsChangedCallback()
}

const render = () => {
  const path = _config.apiPath
  const div = document.querySelector('div.apiConfig')

  if (path) {
    div.classList.add('hidden')
  }

  const params = { path }
  div.innerHTML = buildInnerHTML(params)
}

const buildInnerHTML = (params) => `
  <button name="show" class="toggle">Settings</button>
  <form>
    Enter API URL <br>
    <input type="text" name="api_path" value="${params.path}">
    <button name="save">Save</button>
    <button name="clear">Clear</button>
  </form>
  `

const findCookie = (name) => {
  const match = document.cookie
    .split(';')
    .map((a) => a.split('='))
    .map(([key, value]) => ({ key: key.trim(), value }))
    .find((c) => c.key === name)

  if (!match || !match.value || match.value === '') return undefined

  return match.value
}

const ApiConfiguration = { init, render, config: _config }

export { ApiConfiguration }
