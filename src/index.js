import api from './api'

// handlers
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

import {
  get as getActiveHandler,
  set as setActiveHandler,
} from './handlers/active'

import {
  get as getHeatingThresholdHandler,
  set as setHeatingThresholdHandler,
} from './handlers/heatingThreshold'

import {
  get as getCoolingThresholdHandler,
  set as setCoolingThresholdHandler,
} from './handlers/coolingThreshold'

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

const Thermostat = (log, config) => {
  log('config', config)

  const service = new Service.HeaterCooler(config.name)
  const apiClient = api(config.url)

  const getName = callback => {
    log('getName')
    const value = config.name
    callback(null, value)
  }

  return {
    getServices: () => {
      const informationService = new Service.AccessoryInformation()

      informationService
        .setCharacteristic(Characteristic.Manufacturer, 'iZone')
        .setCharacteristic(Characteristic.Model, '-')
        .setCharacteristic(Characteristic.SerialNumber, '-')

      service
        .getCharacteristic(Characteristic.Active)
        .on('get', getActiveHandler(apiClient, log))
        .on('set', setActiveHandler(apiClient, log))

      service
        .getCharacteristic(Characteristic.CurrentHeaterCoolerState)
        .on(
          'get',
          getCurrentHeaterCoolerStateHandler(apiClient, log, Characteristic)
        )

      service
        .getCharacteristic(Characteristic.TargetHeaterCoolerState)
        .on(
          'get',
          getTargetHeaterCoolerStateHandler(apiClient, log, Characteristic)
        )
        .on(
          'set',
          setTargetHeaterCoolerStateHandler(apiClient, log, Characteristic)
        )

      service
        .getCharacteristic(Characteristic.CurrentTemperature)
        .setProps({ minStep: 0.1 })
        .on('get', getCurrentTemperatureHandler(apiClient, log))

      service
        .getCharacteristic(Characteristic.CoolingThresholdTemperature)
        .setProps({ minValue: 15, maxValue: 30, minStep: 1.0 })
        .on('get', getCoolingThresholdHandler(apiClient, log))
        .on('set', setCoolingThresholdHandler(apiClient, log))

      service
        .getCharacteristic(Characteristic.HeatingThresholdTemperature)
        .setProps({ minValue: 15, maxValue: 30, minStep: 1.0 })
        .on('get', getHeatingThresholdHandler(apiClient, log))
        .on('set', setHeatingThresholdHandler(apiClient, log))

      service
        .getCharacteristic(Characteristic.RotationSpeed)
        .setProps({ minStep: 25, minValue: 0, maxValue: 100 })
        .on('get', getRotationSpeedHandler(apiClient, log))
        .on('set', setRotationSpeedHandler(apiClient, log))

      service.getCharacteristic(Characteristic.Name).on('get', getName)

      return [informationService, service]
    },
  }
}
