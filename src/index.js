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

class Thermostat {
  constructor(log, config) {
    log('constructing')

    this.log = log
    this.service = new Service.HeaterCooler(config.name)

    this.config = config
    this.apiClient = api(config.url)

    log('config', config)

    this.getActive = this.getActive.bind(this)
    this.setActive = this.setActive.bind(this)
    this.setTargetTemperature = this.setTargetTemperature.bind(this)
    this.getTargetTemperature = this.getTargetTemperature.bind(this)
    this.getCurrentTemperature = this.getCurrentTemperature.bind(this)
    this.setTargetHeaterCoolerState = this.setTargetHeaterCoolerState.bind(this)
    this.getTargetHeaterCoolerState = this.getTargetHeaterCoolerState.bind(this)
    this.getCurrentHeaterCoolerState = this.getCurrentHeaterCoolerState.bind(
      this
    )
  }

  // callback usage
  // callback() - successful write action
  // callback(null, newValue) - successful read action
  // callback(error) - error

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

  setTargetTemperature(value, callback) {
    this.log('setTargetTemperature: ', value)
    this.apiClient
      .setUnitSetpoint(value)
      .then(() => {
        this.log('setTargetTemperature OK')
        callback()
      })
      .catch(e => {
        // TODO: lib to convert api promise to callback pattern with logging
        this.log('setTargetTemperature', e)
        callback(e)
      })
  }

  getTargetTemperature(callback) {
    this.log('getTargetTemperature')
    this.apiClient
      .getUnitSetpoint()
      .then(value => callback(null, value))
      .catch(e => callback(e))
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

    this.informationService
      .setCharacteristic(Characteristic.Manufacturer, this.manufacturer)
      .setCharacteristic(Characteristic.Model, this.model)
      .setCharacteristic(Characteristic.SerialNumber, this.serial)

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
      .on('get', this.getTargetTemperature.bind(this))
      .on('set', this.setTargetTemperature.bind(this))

    this.service
      .getCharacteristic(Characteristic.HeatingThresholdTemperature)
      .setProps({ minValue: 15, maxValue: 30, minStep: 1.0 })
      .on('get', this.getTargetTemperature.bind(this))
      .on('set', this.setTargetTemperature.bind(this))

    // TODO: Characteristic.RotationSpeed for high/med/low fan speed

    // this.service
    //   .getCharacteristic(Characteristic.TemperatureDisplayUnits)
    //   .on('get', this.getTemperatureDisplayUnits.bind(this))
    //   .on('set', this.setTemperatureDisplayUnits.bind(this))

    this.service
      .getCharacteristic(Characteristic.Name)
      .on('get', this.getName.bind(this))

    return [this.informationService, this.service]
  }
}
