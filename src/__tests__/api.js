import api from '../api'
import { MODES } from '../api'
import systemSettingsResponse from '../__fixtures__/systemSettings'

const testWriteAction = (doAction, expectedPath, expectedBody) => {
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

test('setPower on', () => {
  testWriteAction(
    client => client.setPower(true),
    'SystemON',
    '{"SystemON":"on"}'
  )
})

test('setPower off', () => {
  testWriteAction(
    client => client.setPower(false),
    'SystemON',
    '{"SystemON":"off"}'
  )
})

test('setPower on error', () => {
  const fetch = jest.fn()
  fetch.mockResolvedValueOnce({ ok: false, statusText: 'TEST RESULT' })
  fetch.mockResolvedValueOnce({})

  const client = api('http://example.com/', fetch)

  client
    .setPower(true)
    .catch(e => expect(e.toString()).toEqual('API ERROR: TEST RESULT'))
})

test('setMode cool', () => {
  testWriteAction(
    client => client.setMode(MODES.cool),
    'SystemMODE',
    '{"SystemMODE":"cool"}'
  )
})

test('setUnitSetpoint', () => {
  testWriteAction(
    client => client.setUnitSetpoint(24.0),
    'UnitSetpoint',
    '{"UnitSetpoint":"24"}'
  )
})

test('getUnitSetpoint', () => {
  const fetch = jest.fn()
  fetch.mockResolvedValueOnce({ ok: true, json: () => systemSettingsResponse })

  const client = api('http://example.com/', fetch)

  client.getUnitSetpoint().then(result => {
    expect(result).toEqual(25.0)
  })

  expect(fetch.mock.calls).toEqual([['http://example.com/SystemSettings']])
})

test('getActualTemperature', () => {
  const fetch = jest.fn()
  fetch.mockResolvedValueOnce({ ok: true, json: () => systemSettingsResponse })

  const client = api('http://example.com/', fetch)

  client.getActualTemperature().then(result => {
    expect(result).toEqual(29.0)
  })

  expect(fetch.mock.calls).toEqual([['http://example.com/SystemSettings']])
})

test('getMode', () => {
  const fetch = jest.fn()
  fetch.mockResolvedValueOnce({ ok: true, json: () => systemSettingsResponse })

  const client = api('http://example.com/', fetch)

  client.getMode().then(result => {
    expect(result).toEqual(MODES.cool)
  })

  expect(fetch.mock.calls).toEqual([['http://example.com/SystemSettings']])
})
