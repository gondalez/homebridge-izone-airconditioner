import { readHandler } from './'

export const get = (api, log) =>
  readHandler('CurrentTemperature', api.getActualTemperature, log)
