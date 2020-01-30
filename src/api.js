import nodeFetch from 'node-fetch'

export default function(url, fetch = nodeFetch) {
  // TODO: parse url and be flexible on trailing slashes, http:// etc. tests!
  // TODO: helper for write actions
  // TODO: helper for read actions

  // TODO:
  // actions
  // * getCurrentTemperature (SystemSettings Temp attrib (or null if zero))
  // * setTargetHeatCoolState (send systemON then SystemMODE)
  // * getCurrentHeatCoolState (SystemSettings SysMode attrib)
  const postJson = buildPostJson(fetch)
  const readFloatAttribute = buildReadFloatAttribute(fetch)

  return {
    setUnitSetpoint: value =>
      postJson(`${url}UnitSetpoint`, { UnitSetpoint: value.toString() }),
    getUnitSetpoint: value =>
      readFloatAttribute(`${url}SystemSettings`, 'Setpoint'),
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

const buildPostJson = fetch => (url, body) =>
  fetch(url, {
    method: 'post',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
    .then(checkStatus)
    .then(_res => true)
