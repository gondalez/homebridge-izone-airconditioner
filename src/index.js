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
    this.service = new Service.Thermostat(config.name)

    this.config = config

    this.setTargetTemperature = this.setTargetTemperature.bind(this)
    this.getTargetTemperature = this.getTargetTemperature.bind(this)
    this.getCurrentTemperature = this.getCurrentTemperature.bind(this)
    this.setTargetHeatingCoolingState = this.setTargetHeatingCoolingState.bind(
      this
    )
    this.getTargetHeatingCoolingState = this.getTargetHeatingCoolingState.bind(
      this
    )
    this.getCurrentHeatingCoolingState = this.getCurrentHeatingCoolingState.bind(
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

  setTargetTemperature(value, callback) {
    this.log('setTargetTemperature: ', value)
    callback()
  }

  getTargetTemperature(callback) {
    this.log('getTargetTemperature')
    const value = 24 // TODO
    callback(null, value)
  }

  getCurrentTemperature(callback) {
    this.log('getCurrentTemperature')
    const value = 32 // TODO
    callback(null, value)
  }

  setTargetHeatingCoolingState(value, callback) {
    this.log('setTargetHeatingCoolingState: ', value)
    callback()
  }

  getTargetHeatingCoolingState(callback) {
    // Characteristic.TargetHeatingCoolingState.OFF = 0;
    // Characteristic.TargetHeatingCoolingState.HEAT = 1;
    // Characteristic.TargetHeatingCoolingState.COOL = 2;
    // Characteristic.TargetHeatingCoolingState.AUTO = 3;

    this.log('getTargetHeatingCoolingState')
    const value = Characteristic.TargetHeatingCoolingState.COOL
    callback(null, value)
  }

  getCurrentHeatingCoolingState(callback) {
    // Characteristic.TargetHeatingCoolingState.OFF = 0;
    // Characteristic.TargetHeatingCoolingState.HEAT = 1;
    // Characteristic.TargetHeatingCoolingState.COOL = 2;

    this.log('getCurrentHeatingCoolingState')
    const value = Characteristic.CurrentHeatingCoolingState.COOL
    callback(null, value)
  }

  getServices() {
    this.informationService = new Service.AccessoryInformation()

    this.informationService
      .setCharacteristic(Characteristic.Manufacturer, this.manufacturer)
      .setCharacteristic(Characteristic.Model, this.model)
      .setCharacteristic(Characteristic.SerialNumber, this.serial)

    this.service
      .getCharacteristic(Characteristic.CurrentHeatingCoolingState)
      .on('get', this.getCurrentHeatingCoolingState.bind(this))

    this.service
      .getCharacteristic(Characteristic.TargetHeatingCoolingState)
      .on('get', this.getTargetHeatingCoolingState.bind(this))
      .on('set', this.setTargetHeatingCoolingState.bind(this))

    this.service
      .getCharacteristic(Characteristic.CurrentTemperature)
      .on('get', this.getCurrentTemperature.bind(this))

    this.service
      .getCharacteristic(Characteristic.TargetTemperature)
      .on('get', this.getTargetTemperature.bind(this))
      .on('set', this.setTargetTemperature.bind(this))

    // this.service
    //   .getCharacteristic(Characteristic.TemperatureDisplayUnits)
    //   .on('get', this.getTemperatureDisplayUnits.bind(this))
    //   .on('set', this.setTemperatureDisplayUnits.bind(this))

    this.service
      .getCharacteristic(Characteristic.Name)
      .on('get', this.getName.bind(this))

    this.service.getCharacteristic(Characteristic.CurrentTemperature).setProps({
      minStep: 0.1,
    })

    this.service.getCharacteristic(Characteristic.TargetTemperature).setProps({
      minValue: 20,
      maxValue: 30,
      minStep: 1.0,
    })

    return [this.informationService, this.service]
  }
}
