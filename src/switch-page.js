import { ApiConfiguration } from './configuration.js'
import { Deconz } from './deconz.js'
import { Data } from './data-store.js'
import { Helpers } from './helpers.js'

window.onload = () => {
  ApiConfiguration.init(apiPathIsChangedCallback)
  document.querySelector('div.deviceList ul').addEventListener('click', (e) => handleDeviceListClick(e))

  setInterval(getElements, 5000)

  ApiConfiguration.render()
  getElements()
}

const handleDeviceListClick = async (e) => {
  const button = e.target.closest('button')

  if (!button) return

  e.preventDefault()

  if (button.classList.contains('edit-settings')) {
    const itemContainer = e.target.closest('.device-list-item')

    if (itemContainer.classList.contains('expanded')) {
      itemContainer.classList.remove('expanded')
    } else {
      document.querySelectorAll('.expanded').forEach((e) => {
        e.classList.remove('expanded')
      })

      itemContainer.classList.add('expanded')
    }
  }

  if (button.name === 'save-settings') {
    const itemContainer = e.target.closest('.device-list-item')
    const settingsContainer = e.target.closest('.item-settings')

    const id = settingsContainer.id

    const lightInputs = settingsContainer.querySelectorAll('input[name="paired-light"]')
    const lights = [...lightInputs].filter((i) => i.checked).map((i) => i.id)

    const deviceGroup = Data.Groups.get(id)

    if (hasSameLights(deviceGroup.lights, lights)) {
      return
    }

    await Deconz.put(`/groups/${id}`, { lights })

    itemContainer.classList.remove('expanded')

    getElements()
  }
}

const hasSameLights = (a, b) => a.sort().toString() == b.sort().toString()

const apiPathIsChangedCallback = () => {
  ApiConfiguration.render()
  getElements()
}

const getElements = async () => {
  const data = await Deconz.getElements()

  Data.update(data)

  renderSwitches()
}

const renderSwitches = () => {
  const div = document.querySelector('div.deviceList')
  const ul = div.querySelector('ul')

  const switches = Data.Switches.all()

  const listItems = switches.map(drawSwitch)

  Helpers.replaceChildren(ul, listItems, nodeIsExpanded)
}

const nodeIsExpanded = (existingItem) => existingItem.classList.contains('expanded')

const drawSwitch = (params) => {
  params.pairedLights = getPairedDevices(params.deviceGroupId)
  params.allLights = Data.Lights.all()

  const listItem = document.createElement('li')
  listItem.innerHTML = switchTemplate(params)
  listItem.id = params.id
  listItem.classList.add('device-list-item')

  return listItem
}

const getPairedDevices = (deviceGroupId) => {
  if (!deviceGroupId) return []

  const deviceGroup = Data.Groups.get(deviceGroupId)

  return deviceGroup.lights.map((lightId) => Data.Lights.get(lightId))

  return [deviceGroupId]
}

const switchTemplate = (params) => `
  <h3 class="name">${params.name}</h3>
  <div class="">Id: ${params.id}</div>
  <div class="">Type: ${params.type}</div>
  <div class="">Brand/model: ${params.manufacturername} / ${params.modelid}</div>
  ${params.deviceGroupId ? deviceGroupTemplate(params) : '<div>Device not pairable</div>'}`

const deviceGroupTemplate = (params) => `
  <div id="${params.deviceGroupId}">
    Paired lights (group ${params.deviceGroupId}) 
    <button class="edit-settings">Edit</button>
  </div>
  <ul class="paired-lights">${pairedLightsTemplate(params.pairedLights)}</ul>
  <div id="${params.deviceGroupId}" class="item-settings">
    <ul>${pairedLightsOptionsTemplate(params)}</ul>
    <button name="save-settings">OK</button>
  </div>`

const pairedLightsTemplate = (lights) => lights.map((light) => `<li>${light.name}</li>`).join('')

const pairedLightsOptionsTemplate = ({ allLights, pairedLights }) =>
  allLights.map(lightOptionTemplate(pairedLights)).join('')

const lightOptionTemplate = (pairedLights) => (light) => `
  <li>
    <input name="paired-light" id="${light.id}" type="checkbox" ${pairedLights.includes(light) ? ' checked' : ''}>
    ${light.name}
  </li>`
