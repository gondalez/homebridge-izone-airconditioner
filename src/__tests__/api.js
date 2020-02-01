import api from '../api'
import { MODES } from '../api'
import systemSettingsResponse from '../__fixtures__/systemSettings'

test('setPower on', () => {
  testWrite(client => client.setPower(true), 'SystemON', '{"SystemON":"on"}')
})

test('setPower off', () => {
  testWrite(client => client.setPower(false), 'SystemON', '{"SystemON":"off"}')
})

test('setMode cool', () => {
  testWrite(
    client => client.setMode(MODES.cool),
    'SystemMODE',
    '{"SystemMODE":"cool"}'
  )
})

test('setUnitSetpoint', () => {
  testWrite(
    client => client.setUnitSetpoint(24.0),
    'UnitSetpoint',
    '{"UnitSetpoint":"24"}'
  )
})

test('getUnitSetpoint', () => {
  testRead(client => client.getUnitSetpoint(), 25.0)
})

test('getActualTemperature', () => {
  testRead(client => client.getActualTemperature(), 29.0)
})

test('getMode', () => {
  testRead(client => client.getMode(), MODES.cool)
})

test('error handling', () => {
  const fetch = jest.fn()
  fetch.mockResolvedValueOnce({ ok: false, statusText: 'TEST RESULT' })
  fetch.mockResolvedValueOnce({})

  const client = api('http://example.com/', fetch)

  client
    .setPower(true)
    .catch(e => expect(e.toString()).toEqual('API ERROR: TEST RESULT'))
})

const testRead = (action, expectedResult) => {
  const fetch = jest.fn()
  fetch.mockResolvedValueOnce({ ok: true, json: () => systemSettingsResponse })

  const client = api('http://example.com/', fetch)

  action(client).then(result => {
    expect(result).toEqual(expectedResult)
  })

  expect(fetch.mock.calls).toEqual([['http://example.com/SystemSettings']])
}

const testWrite = (doAction, expectedPath, expectedBody) => {
  const fetch = jest.fn()
  fetch.mockResolvedValueOnce({ ok: true })
  fetch.mockResolvedValueOnce({})

  const client = api('http://example.com/', fetch)

  doAction(client)

  expect(fetch.mock.calls).toEqual([
    [
      `http://example.com/${expectedPath}`,
      {
        body: expectedBody,
        headers: { 'Content-Type': 'application/json' },
        method: 'post',
      },
    ],
  ])
}
