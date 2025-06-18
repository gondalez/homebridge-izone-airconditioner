import { get, set } from '../../handlers/rotationSpeed'
import { genericTestRead, genericTestWrite } from '../../handlers/testHelpers'

const testRead = (apiReturns, expected) =>
  genericTestRead('getFanSpeed', get, apiReturns, expected)
const testWrite = (rawValue, expectedApiValue, expectedCallback) =>
  genericTestWrite(
    'setFanSpeed',
    set,
    rawValue,
    expectedApiValue,
    expectedCallback
  )

test('get low', () => testRead('low', [null, 25]))
test('get medium', () => testRead('med', [null, 50]))
test('get high', () => testRead('high', [null, 75]))
test('get auto', () => testRead('auto', [null, 100]))
test('get unrecognized', () =>
  testRead('BLARGH', ['Unrecognized value BLARGH']))

test('set 25', () => testWrite(0, 'low'))
test('set 25', () => testWrite(25, 'low'))
test('set 50', () => testWrite(50, 'medium'))
test('set 75', () => testWrite(75, 'high'))
test('set 100', () => testWrite(100, 'auto'))
test('set unrecognized', () =>
  expect(() => testWrite(999, 'auto')).toThrow('Unrecognized value 999'))
