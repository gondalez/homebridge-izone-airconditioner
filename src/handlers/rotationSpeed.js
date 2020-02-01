import { readHandler, writeHandler } from './'

// unit is percentage
// off = 0 | low = 25 | med = 50 | high = 75 | auto = 100

export const get = (api, log) =>
  readHandler('RotationSpeed', api.getFanSpeed, log, value => {
    switch (value) {
      case 'low':
        return 25
      case 'med':
        return 50
      case 'high':
        return 75
      case 'auto':
        return 100
      default:
        return 0
    }
  })

export const set = (api, log) =>
  writeHandler('RotationSpeed', api.setFanSpeed, log, value => {
    switch (value) {
      case 0:
        return 'low'
      case 25:
        return 'low'
      case 50:
        return 'medium'
      case 75:
        return 'high'
      case 100:
        return 'auto'
      default:
        return 'low'
    }
  })
