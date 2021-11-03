let _switches = []
let _lights = []
let _groups = []

const mapToList = (uglyList) =>
  Object.entries(uglyList)
    .map(([id, params]) => ({ id, ...params }))
    .sort((a, b) => a.name.localeCompare(b.name))

const isSwitch = (sensor) => sensor.type === 'ZHASwitch'

const findDeviceGroup = (deviceId) => (group) => group.devicemembership.includes(deviceId)

const makeSwitches = (rawSwitches, rawGroups, rawLights) =>
  rawSwitches.map((rawSwitch) => {
    const matchingDeviceGroup = rawGroups.find(findDeviceGroup(rawSwitch.id))

    const result = {
      ...rawSwitch,
      deviceGroupId: matchingDeviceGroup ? matchingDeviceGroup.id : undefined
    }

    return result
  })

const update = (rawData) => {
  const before = Date.now()
  const rawGroups = mapToList(rawData.groups)
  const rawSwitches = mapToList(rawData.sensors).filter(isSwitch)
  const rawLights = mapToList(rawData.lights)

  _switches = makeSwitches(rawSwitches, rawGroups, rawLights)
  _lights = rawLights
  _groups = rawGroups
}

const Switches = {
  all: () => _switches,
  get: (id) => _switches.find((s) => s.id == id)
}

const Groups = {
  all: () => _groups,
  get: (id) => _groups.find((s) => s.id == id)
}

const Lights = {
  all: () => _lights,
  get: (id) => _lights.find((s) => s.id == id)
}

const Data = {
  Groups,
  Lights,
  Switches,
  update
}

export { Data }
