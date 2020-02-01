import api from './api'
import { readHandler, writeHandler } from './handlers'
import { get as getCurrentHeaterCoolerStateHandler } from './handlers/currentHeaterCoolerState'
import {
  get as getTargetHeaterCoolerStateHandler,
  set as setTargetHeaterCoolerStateHandler,
} from './handlers/targetHeaterCoolerState'
import { get as getCurrentTemperatureHandler } from './handlers/currentTemperature'
import {
  get as getRotationSpeedHandler,
  set as setRotationSpeedHandler,
} from './handlers/rotationSpeed'

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

    // TODO: extract handlers into ./handlers/** and test

    this.service
      .getCharacteristic(Characteristic.CurrentHeaterCoolerState)
      .on('get', getCurrentHeaterCoolerStateHandler(api, log, Characteristic))

    this.service
      .getCharacteristic(Characteristic.TargetHeaterCoolerState)
      .on('get', getTargetHeaterCoolerStateHandler(api, log, Characteristic))
      .on('set', setTargetHeaterCoolerStateHandler(api, log, Characteristic))

    this.service
      .getCharacteristic(Characteristic.CurrentTemperature)
      .on('get', getCurrentTemperatureHandler(api, log))
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

    this.service
      .getCharacteristic(Characteristic.RotationSpeed)
      .setProps({ minStep: 25, minValue: 0, maxValue: 100 })
      .on('get', getRotationSpeedHandler(api, log))
      .on('set', setRotationSpeedHandler(api, log))

    this.service
      .getCharacteristic(Characteristic.Name)
      .on('get', this.getName.bind(this))

    return [this.informationService, this.service]
  }
}
