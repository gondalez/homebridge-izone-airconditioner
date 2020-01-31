import api from '../api'
import { MODES } from '../api'
import systemSettingsResponse from '../__fixtures__/systemSettings'

// TODO: investigate promise errors

test('setPower on', () => {
  const fetch = jest.fn()
  fetch.mockResolvedValueOnce({})
  fetch.mockResolvedValueOnce({})

  const client = api('http://example.com/', fetch)

  client.setPower(true)

  expect(fetch.mock.calls).toEqual([
    [
      'http://example.com/SystemON',
      {
        body: '{"SystemON":"on"}',
        headers: { 'Content-Type': 'application/json' },
        method: 'post',
      },
    ],
  ])
})

test('setPower off', () => {
  const fetch = jest.fn()
  fetch.mockResolvedValueOnce({})
  fetch.mockResolvedValueOnce({})

  const client = api('http://example.com/', fetch)

  client.setPower(false)

  expect(fetch.mock.calls).toEqual([
    [
      'http://example.com/SystemON',
      {
        body: '{"SystemON":"off"}',
        headers: { 'Content-Type': 'application/json' },
        method: 'post',
      },
    ],
  ])
})

test('setMode cool', () => {
  const fetch = jest.fn()
  fetch.mockResolvedValueOnce({})
  fetch.mockResolvedValueOnce({})

  const client = api('http://example.com/', fetch)

  client.setMode(MODES.cool)

  expect(fetch.mock.calls).toEqual([
    [
      'http://example.com/SystemMODE',
      {
        body: '{"SystemMODE":"cool"}',
        headers: { 'Content-Type': 'application/json' },
        method: 'post',
      },
    ],
  ])
})

test('setUnitSetpoint', () => {
  const fetch = jest.fn()
  fetch.mockResolvedValueOnce({})
  fetch.mockResolvedValueOnce({})

  const client = api('http://example.com/', fetch)

  client.setUnitSetpoint(24.0)

  expect(fetch.mock.calls).toEqual([
    [
      'http://example.com/UnitSetpoint',
      {
        body: '{"UnitSetpoint":"24"}',
        headers: { 'Content-Type': 'application/json' },
        method: 'post',
      },
    ],
  ])
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
