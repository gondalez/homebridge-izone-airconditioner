const log = () => {}

export const genericTestRead = (
  apiMethod,
  builder,
  apiReturns,
  expectedCallback
) => {
  const api = {
    [apiMethod]: () => new Promise((resolve, reject) => resolve(apiReturns)),
  }

  const callback = jest.fn()
  const handler = builder(api, log)
  return handler(callback).then(() => {
    expect(callback.mock.calls).toEqual([expectedCallback])
  })
}

export const genericTestWrite = (
  apiMethod,
  builder,
  rawValue,
  expectedApiValue,
  expectedCallback = []
) => {
  const api = {
    [apiMethod]: value =>
      new Promise((resolve, reject) => {
        expect(value).toEqual(expectedApiValue)
        resolve()
      }),
  }
  const callback = jest.fn()
  const handler = builder(api, log)
  return handler(rawValue, callback).then(() => {
    expect(callback.mock.calls).toEqual([expectedCallback])
  })
}
