import { readHandler, writeHandler } from './'

// What the cooler is tasked with doing.

// static readonly AUTO = 0;
// static readonly HEAT = 1;
// static readonly COOL = 2;

export const get = (api, log, Characteristic) =>
  readHandler('TargetHeaterCoolerState', api.getMode, log, value => {
    switch (value) {
      case 'cool':
        return Characteristic.TargetHeaterCoolerState.COOL
      case 'heat':
        return Characteristic.TargetHeaterCoolerState.HEAT
      case 'vent':
        return Characteristic.TargetHeaterCoolerState.COOL
      case 'dry':
        return Characteristic.TargetHeaterCoolerState.COOL
      case 'auto':
        return Characteristic.TargetHeaterCoolerState.AUTO
      default:
        throw `Unrecognized value ${value}`
    }
  })

export const set = (api, log, Characteristic) =>
  writeHandler('TargetHeaterCoolerState', api.setMode, log, value => {
    switch (value) {
      case Characteristic.TargetHeaterCoolerState.COOL:
        return 'cool'
      case Characteristic.TargetHeaterCoolerState.HEAT:
        return 'heat'
      case Characteristic.TargetHeaterCoolerState.AUTO:
        return 'auto'
      default:
        throw `Unrecognized value ${value}`
    }
  })
