import { readHandler, writeHandler } from './'

export const get = (api, log) => readHandler('Active', api.getPower, log)
export const set = (api, log) => writeHandler('Active', api.setPower, log)
