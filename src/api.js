import nodeFetch from 'node-fetch'
import URI from 'urijs'
import { flow, flattenDeep, reject, sum } from 'lodash/fp'

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
  const getTemps = zones => zones.map(zone => parseFloat(zone.Temp))

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
      Promise.all([
        readFloatAttribute(`${url}SystemSettings`, 'Temp'),
        getJson(fetch, `${url}Zones1_4`).then(getTemps),
        getJson(fetch, `${url}Zones5_8`).then(getTemps),
        getJson(fetch, `${url}Zones9_12`).then(getTemps),
      ]).then((...temperatures) => getAverageTemperature(temperatures)),
    getPowerAndMode: () =>
      Promise.all([
        readOnOffAttribute(`${url}SystemSettings`, 'SysOn'),
        readStringAttribute(`${url}SystemSettings`, 'SysMode'),
      ]),
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

const getJson = (fetch, url) => fetch(url).then(checkStatus).then(res => res.json())

const readAttribute = (fetch, url, attribute) => getJson(fetch, url).then(data => data[attribute])

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

const extractTemperatures = flow(flattenDeep, reject(val => val == 0))

const getAverageTemperature = rawTemperatures => {
  const temperatures = extractTemperatures(rawTemperatures)

  if (temperatures.length === 0) return 0

  return sum(temperatures) / temperatures.length
}
