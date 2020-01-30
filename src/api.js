import fetch from 'node-fetch'

export default function(url) {
  // TODO: parse url and ensure trailing slash
  // TODO: helper for write actions
  // TODO: helper for read actions
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
        .then(parsed => parsed.Setpoint)
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
