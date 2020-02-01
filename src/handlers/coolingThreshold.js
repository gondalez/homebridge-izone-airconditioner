import { readHandler, writeHandler } from './'

export const get = (api, log) =>
  readHandler('CoolingThreshold', api.getUnitSetpoint, log)

export const set = (api, log) =>
  writeHandler('CoolingThreshold', api.setUnitSetpoint, log)
