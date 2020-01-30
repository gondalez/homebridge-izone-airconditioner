import api from '../api'
import systemSettingsResponse from '../__fixtures__/systemSettings'

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
