import nodeFetch from 'node-fetch'

export const MODES = {
  cool: 'cool',
  heat: 'heat',
  vent: 'vent',
  dry: 'dry',
  auto: 'auto',
}

export default function(url, fetch = nodeFetch) {
  // TODO: parse url and be flexible on trailing slashes, http:// etc. tests!
  // TODO: helper for write actions
  // TODO: helper for read actions

  // TODO:
  // actions
  // * getCurrentTemperature (SystemSettings Temp attrib (or null if zero))
  // * setTargetHeatCoolState (send systemON then SystemMODE)
  // * getCurrentHeatCoolState (SystemSettings SysMode attrib)
  // * setPower (SystemON)
  const postJson = buildPostJson(fetch)
  const readFloatAttribute = buildReadFloatAttribute(fetch)
  const readStringAttribute = buildReadStringAttribute(fetch)

  return {
    setUnitSetpoint: value =>
      postJson(`${url}UnitSetpoint`, { UnitSetpoint: value.toString() }),
    setPower: value =>
      postJson(`${url}SystemON`, { SystemON: value ? 'on' : 'off' }),
    setMode: value => postJson(`${url}SystemMODE`, { SystemMODE: value }),
    getUnitSetpoint: () =>
      readFloatAttribute(`${url}SystemSettings`, 'Setpoint'),
    getActualTemperature: () =>
      readFloatAttribute(`${url}SystemSettings`, 'Supply'),
    getHeatCoolState: () =>
      readStringAttribute(`${url}SystemSettings`, 'SysMode'),
  }
}

function checkStatus(res) {
  if (res.ok) {
    // res.status >= 200 && res.status < 300
    return res
  } else {
    throw `API ERROR ${res.statusText}`
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

const buildPostJson = fetch => (url, body) =>
  fetch(url, {
    method: 'post',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
    .then(checkStatus)
    .then(_res => true)
