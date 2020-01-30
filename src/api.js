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

  return {
    setUnitSetpoint: value => {
      return fetch(`${url}UnitSetpoint`, {
        method: 'post',
        body: JSON.stringify({ UnitSetpoint: value.toString() }),
        headers: { 'Content-Type': 'application/json' },
      })
        .then(checkStatus)
        .then(_res => true)
    },
    getUnitSetpoint: value => {
      return fetch(`${url}SystemSettings`)
        .then(checkStatus)
        .then(res => res.json())
        .then(parsed => parseFloat(parsed.Setpoint))
    },
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
