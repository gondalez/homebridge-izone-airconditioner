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

const writeHandler = (name, target, log) => (value, callback) => {
  log(name, 'BEGIN WRITE', value)

  return target(value)
    .then(() => {
      log(name, 'WRITE OK', value)
      callback()
    })
    .catch(e => {
      log(name, 'WRITE ERROR', value, e)
      callback(e)
    })
}

const readHandler = (name, target, log) => callback => {
  log(name, 'BEGIN READ')

  return target()
    .then(value => {
      log(name, 'READ OK', value)
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

  getActive(callback) {
    this.log('getActive')
    const value = true
    callback(null, value)
  }

  setActive(value, callback) {
    this.log('setActive: ', value)
    callback()
  }

  getRotationSpeed(callback) {
    this.log('getRotationSpeed')
    const value = 66.6
    callback(null, value)
  }

  setRotationSpeed(value, callback) {
    this.log('setRotationSpeed: ', value)
    callback()
  }

  getCurrentTemperature(callback) {
    this.log('getCurrentTemperature')
    const value = 32 // TODO
    callback(null, value)
  }

  setTargetHeaterCoolerState(value, callback) {
    this.log('setTargetHeaterCoolerState: ', value)
    // TODO: set state locally for use in getTargetHeaterCoolerState
    // TODO: api call
    callback()
  }

  getTargetHeaterCoolerState(callback) {
    // Characteristic.TargetHeaterCoolerState.OFF = 0;
    // Characteristic.TargetHeaterCoolerState.HEAT = 1;
    // Characteristic.TargetHeaterCoolerState.COOL = 2;
    // Characteristic.TargetHeaterCoolerState.AUTO = 3;

    this.log('getTargetHeaterCoolerState')
    const value = Characteristic.TargetHeaterCoolerState.COOL
    // TODO: read from local var (as set in setTargetHeaterCoolerState prior to hitting the api
    callback(null, value)
  }

  getCurrentHeaterCoolerState(callback) {
    // Characteristic.TargetHeaterCoolerState.OFF = 0;
    // Characteristic.TargetHeaterCoolerState.HEAT = 1;
    // Characteristic.TargetHeaterCoolerState.COOL = 2;

    this.log('getCurrentHeaterCoolerState')
    const value = Characteristic.CurrentHeaterCoolerState.COOL
    // TODO
    callback(null, value)
  }

  getServices() {
    this.informationService = new Service.AccessoryInformation()
    const api = this.apiClient
    const log = this.log

    // TODO: get from api
    this.informationService
      .setCharacteristic(Characteristic.Manufacturer, 'iZone')
      .setCharacteristic(Characteristic.Model, '-')
      .setCharacteristic(Characteristic.SerialNumber, '-')

    this.service
      .getCharacteristic(Characteristic.Active)
      .on('get', this.getActive.bind(this))
      .on('set', this.setActive.bind(this))

    this.service
      .getCharacteristic(Characteristic.CurrentHeaterCoolerState)
      .on('get', this.getCurrentHeaterCoolerState.bind(this))

    this.service
      .getCharacteristic(Characteristic.TargetHeaterCoolerState)
      .on('get', this.getTargetHeaterCoolerState.bind(this))
      .on('set', this.setTargetHeaterCoolerState.bind(this))

    this.service
      .getCharacteristic(Characteristic.CurrentTemperature)
      .on('get', this.getCurrentTemperature.bind(this))
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
      .setProps({ minStep: 33.3 }) // off = 0 | low = 33.3 | med = 66.6 | high = 99.9
      .on('get', this.getRotationSpeed.bind(this))
      .on('set', this.setRotationSpeed.bind(this))

    this.service
      .getCharacteristic(Characteristic.Name)
      .on('get', this.getName.bind(this))

    return [this.informationService, this.service]
  }
}
