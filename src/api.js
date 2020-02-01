import nodeFetch from 'node-fetch'
import URI from 'urijs'

export const MODES = {
  cool: 'cool',
  heat: 'heat',
  vent: 'vent',
  dry: 'dry',
  auto: 'auto',
}

export default function(rawUrl, fetch = nodeFetch) {
  const parsedUrl = URI(rawUrl)
  const protocol = parsedUrl.protocol()

  if (protocol !== 'http' && protocol !== 'https') throw 'Not a valid URL'

  const url = parsedUrl.toString()

  const postJson = buildPostJson(fetch)
  const readFloatAttribute = buildReadFloatAttribute(fetch)
  const readStringAttribute = buildReadStringAttribute(fetch)
  const readOnOffAttribute = buildReadOnOffAttribute(fetch)

  return {
    setPower: value =>
      postJson(`${url}SystemON`, { SystemON: value ? 'on' : 'off' }),
    getPower: () => readOnOffAttribute(`${url}SystemSettings`, 'SysOn'),
    getUnitSetpoint: () =>
      readFloatAttribute(`${url}SystemSettings`, 'Setpoint'),
    setUnitSetpoint: value =>
      postJson(`${url}UnitSetpoint`, { UnitSetpoint: value.toString() }),
    setMode: value => postJson(`${url}SystemMODE`, { SystemMODE: value }),
    getMode: () => readStringAttribute(`${url}SystemSettings`, 'SysMode'),
    setFanSpeed: value => postJson(`${url}SystemFAN`, { SystemFAN: value }),
    getFanSpeed: () => readStringAttribute(`${url}SystemSettings`, 'SysFan'),
    getActualTemperature: () =>
      readFloatAttribute(`${url}SystemSettings`, 'Supply'),
  }
}

function checkStatus(res) {
  if (res.ok) {
    // res.status >= 200 && res.status < 300
    return res
  } else {
    throw `API ERROR: ${res.statusText}`
  }
}

const readAttribute = (fetch, url, attribute) =>
  fetch(url)
    .then(checkStatus)
    .then(res => res.json())
    .then(parsed => parsed[attribute])

const buildReadFloatAttribute = fetch => (url, attribute) =>
  readAttribute(fetch, url, attribute).then(value => parseFloat(value))

const buildReadStringAttribute = fetch => (url, attribute) =>
  readAttribute(fetch, url, attribute).then(value => value.toString())

const buildReadOnOffAttribute = fetch => (url, attribute) =>
  readAttribute(fetch, url, attribute).then(value => value === 'on')

const buildPostJson = fetch => (url, body) =>
  fetch(url, {
    method: 'post',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
    .then(checkStatus)
    .then(_res => true)
