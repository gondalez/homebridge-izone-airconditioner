import api from './api'
let Service, Characteristic

export default function(homebridge) {
  Service = homebridge.hap.Service
  Characteristic = homebridge.hap.Characteristic

  homebridge.registerAccessory(
    'homebridge-izone-airconditioner',
    'iZone Air Conditioner',
    Thermostat
  )
}

// callback usage
// callback() - successful write action
// callback(null, newValue) - successful read action
// callback(error) - error

const writeHandler = (name, target, log, valueTransformer = null) => (
  rawValue,
  callback
) => {
  const value = valueTransformer ? valueTransformer(rawValue) : rawValue
  log(name, 'BEGIN WRITE', rawValue, value)

  return target(value)
    .then(() => {
      log(name, 'WRITE OK', rawValue, value)
      callback()
    })
    .catch(e => {
      log(name, 'WRITE ERROR', rawValue, value, e)
      callback(e)
    })
}

const readHandler = (
  name,
  target,
  log,
  valueTransformer = null
) => callback => {
  log(name, 'BEGIN READ')

  return target()
    .then(rawValue => {
      const value = valueTransformer ? valueTransformer(rawValue) : rawValue
      log(name, 'READ OK', rawValue, value)
      callback(null, value)
    })
    .catch(e => {
      log(name, 'READ ERROR', e)
      callback(e)
    })
}

class Thermostat {
  constructor(log, config) {
    log('constructing')

    this.log = log
    this.service = new Service.HeaterCooler(config.name)

    this.config = config
    this.apiClient = api(config.url)

    log('config', config)
  }

  getName(callback) {
    this.log('getName')
    const value = config.name
    callback(null, value)
  }

  getServices() {
    this.informationService = new Service.AccessoryInformation()
    const api = this.apiClient
    const log = this.log

    this.informationService
      .setCharacteristic(Characteristic.Manufacturer, 'iZone')
      .setCharacteristic(Characteristic.Model, '-')
      .setCharacteristic(Characteristic.SerialNumber, '-')

    this.service
      .getCharacteristic(Characteristic.Active)
      .on('get', readHandler('Active', api.getPower, log))
      .on('set', writeHandler('Active', api.setPower, log))

    // this is what the unit is currently doing
    const getCurrentHeaterCoolerStateHandler = readHandler(
      'CurrentHeaterCoolerState',
      api.getMode,
      log,
      value => {
        // static readonly INACTIVE = 0;
        // static readonly IDLE = 1;
        // static readonly HEATING = 2;
        // static readonly COOLING = 3;

        switch (value) {
          case 'cool':
            return Characteristic.CurrentHeaterCoolerState.COOLING
          case 'heat':
            return Characteristic.CurrentHeaterCoolerState.HEATING
          case 'vent':
            return Characteristic.CurrentHeaterCoolerState.COOLING
          case 'dry':
            return Characteristic.CurrentHeaterCoolerState.COOLING
          case 'auto':
            return Characteristic.CurrentHeaterCoolerState.COOLING
          default:
            return Characteristic.CurrentHeaterCoolerState.INACTIVE
        }
      }
    )

    this.service
      .getCharacteristic(Characteristic.CurrentHeaterCoolerState)
      .on('get', getCurrentHeaterCoolerStateHandler)

    // this is the mode the unit is set to
    const getTargetHeaterCoolerStateHandler = readHandler(
      'TargetHeaterCoolerState',
      api.getMode,
      log,
      value => {
        // static readonly AUTO = 0;
        // static readonly HEAT = 1;
        // static readonly COOL = 2;

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
            return Characteristic.TargetHeaterCoolerState.AUTO
        }
      }
    )

    const setTargetHeaterCoolerStateHandler = writeHandler(
      'TargetHeaterCoolerState',
      api.setMode,
      log,
      value => {
        // static readonly AUTO = 0;
        // static readonly HEAT = 1;
        // static readonly COOL = 2;

        switch (value) {
          case Characteristic.TargetHeaterCoolerState.COOL:
            return 'cool'
          case Characteristic.TargetHeaterCoolerState.HEAT:
            return 'heat'
          case Characteristic.TargetHeaterCoolerState.AUTO:
            return 'auto'
          default:
            return 'auto'
          // throw `Unrecognized value ${value}`
        }
      }
    )

    this.service
      .getCharacteristic(Characteristic.TargetHeaterCoolerState)
      .on('get', getTargetHeaterCoolerStateHandler)
      .on('set', setTargetHeaterCoolerStateHandler)

    const getCurrentTemperatureHandler = readHandler(
      'CurrentTemperature',
      api.getActualTemperature,
      log
    )

    this.service
      .getCharacteristic(Characteristic.CurrentTemperature)
      .on('get', getCurrentTemperatureHandler)
      .setProps({ minStep: 0.1 })

    this.service
      .getCharacteristic(Characteristic.CoolingThresholdTemperature)
      .setProps({ minValue: 15, maxValue: 30, minStep: 1.0 })
      .on('get', readHandler('CoolingThreshold', api.getUnitSetpoint, log))
      .on('set', writeHandler('CoolingThreshold', api.setUnitSetpoint, log))

    this.service
      .getCharacteristic(Characteristic.HeatingThresholdTemperature)
      .setProps({ minValue: 15, maxValue: 30, minStep: 1.0 })
      .on('get', readHandler('HeatingThreshold', api.getUnitSetpoint, log))
      .on('set', writeHandler('HeatingThreshold', api.setUnitSetpoint, log))

    const getRotationSpeedHandler = readHandler(
      'RotationSpeed',
      api.getFanSpeed,
      log,
      value => {
        switch (value) {
          case 'low':
            return 33.3
          case 'medium':
            return 66.6
          case 'high':
            return 99.9
          case 'auto':
            return 99.9
          default:
            return 0.0
        }
      }
    )

    const setRotationSpeedHandler = writeHandler(
      'RotationSpeed',
      api.setFanSpeed,
      log,
      value => {
        switch (value) {
          case 0.0:
            return 'low'
          case 33.3:
            return 'low'
          case 66.6:
            return 'medium'
          case 99.9:
            return 'high'
          default:
            return 'low'
        }
      }
    )

    this.service
      .getCharacteristic(Characteristic.RotationSpeed)
      .setProps({ minStep: 33.3 }) // off = 0 | low = 33.3 | med = 66.6 | high = 99.9
      .on('get', getRotationSpeedHandler)
      .on('set', setRotationSpeedHandler)

    this.service
      .getCharacteristic(Characteristic.Name)
      .on('get', this.getName.bind(this))

    return [this.informationService, this.service]
  }
}
