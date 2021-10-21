const init = (updateApiPath) => {
  document.querySelector('div.apiConfig').addEventListener('click', (e) => handleApiConfigClick(e, updateApiPath))
}

const handleApiConfigClick = (e, updateApiPath) => {
  const button = e.target.closest('button')
  e.preventDefault()

  if (!button) return

  if (button.name === 'save') {
    const input = document.querySelector("input[name='api_path']")
    updateApiPath(input.value)
  }

  if (button.name === 'clear') {
    updateApiPath('')
  }

  if (button.name === 'show') {
    const div = document.querySelector('div.apiConfig')
    div.classList.toggle('hidden')
  }
}

const render = (path) => {
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

const ApiConfiguration = { init, render }

export { ApiConfiguration }
