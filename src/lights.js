let globalData

const init = (apiCall, _globalData) => {
  document.querySelector('div.deviceList ul').addEventListener('click', (e) => handleLightListClick(e, apiCall))
  globalData = _globalData
}

const handleLightListClick = (e, apiCall) => {
  e.preventDefault()

  const button = e.target.closest('.indicator')

  if (!button) return

  const parent = e.target.closest('li')
  const id = parent.id

  apiCall(`/lights/${id}/state`, { alert: 'select' })

  console.log('flash light ', id)
}

const render = () => {

  const div = document.querySelector('div.deviceList')
  const ul = div.querySelector('ul')

  const { lights } = globalData

  if (lights.length == 0) {
    div.classList.add('hidden')
  } else {
    div.classList.remove('hidden')
  }

  const listItems = lights.map(drawLight)

  ul.replaceChildren(...listItems)
}

const drawLight = (params) => {
  const listItem = document.createElement('li')
  listItem.innerHTML = lightTemplate(params)
  listItem.id = params.id
  listItem.classList.add('device-list-item')

  if (params.state.on) {
    listItem.classList.add('on')
  }

  return listItem
}

const lightTemplate = (params) => `
  <span class="indicator"></span>
  <h3 class="name">${params.name}</h3>
  <br>
  <span class="light">Type: ${params.type}</span>
  <br>
  <span class="light">Type: ${params.manufacturername} ${params.modelid}</span>
  `

const Lights = { init, render }

export { Lights }
