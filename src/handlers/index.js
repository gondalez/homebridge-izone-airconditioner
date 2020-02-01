export const writeHandler = (name, target, log, valueTransformer = null) => (
  rawValue,
  callback
) => {
  const value = valueTransformer ? valueTransformer(rawValue) : rawValue
  log(name, 'BEGIN WRITE', rawValue, value)

  return target(value)
    .then(() => {
      log(name, 'WRITE OK', rawValue, value)
      callback()
    })
    .catch(e => {
      log(name, 'WRITE ERROR', rawValue, value, e)
      callback(e)
    })
}

export const readHandler = (
  name,
  target,
  log,
  valueTransformer = null
) => callback => {
  log(name, 'BEGIN READ')

  return target()
    .then(rawValue => {
      const value = valueTransformer ? valueTransformer(rawValue) : rawValue
      log(name, 'READ OK', rawValue, value)
      callback(null, value)
    })
    .catch(e => {
      log(name, 'READ ERROR', e)
      callback(e)
    })
}
