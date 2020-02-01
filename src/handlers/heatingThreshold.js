import { readHandler, writeHandler } from './'

export const get = (api, log) =>
  readHandler('HeatingThreshold', api.getUnitSetpoint, log)

export const set = (api, log) =>
  writeHandler('HeatingThreshold', api.setUnitSetpoint, log)
