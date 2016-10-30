const pad = `  `

function getOptionsLines(options) {
  return Object.keys(options).map(key => {
    const option = options[key]

    const names = option.name || option.names.join(', ')
    let spacing = `\t\t`
    if (names.length > 10) {
      spacing = `\t`
    }
    if (names.length < 5) {
      spacing = `\t\t\t`
    }
    return `${pad}${names}${spacing}${option.help || ''}${option.required && ' (*required)' || ''}`
  })
}

export function help({ pkgInfo, handlers, globalOptions, usage, description }) {
  const handlersLines = handlers && Object.keys(handlers).length && [
    `Commands:\n`,
  ].concat(
    Object.keys(handlers).map(key => {
      const handler = handlers[key]
      return `${pad}- ${handler.name}\t\t${handler.help || ''}`
    })
  ).concat([``])

  // TODO(sam) this and handlersLines are the same thing, refactor later
  const globalOptionsLines = globalOptions && Object.keys(globalOptions).length && [
    `Global Options:\n`,
  ].concat(getOptionsLines(globalOptions)).concat([``])

  const lines = [
    ``,
    pkgInfo ? `${pkgInfo.name} ${pkgInfo.version}\n`: null,
    description ? `${pad}${description}\n` : null,
    usage ? `Usage: ${usage}\n` : null,
  ]
  .concat(handlersLines)
  .concat(globalOptionsLines)
  .filter(a => a !== null && a !== undefined)

  lines.forEach(line => {
    console.log(`${pad}${line}`)
  })
}

export function detailedHelp({ handler }) {
  const optionsLines = handler.options && Object.keys(handler.options).length && [
    `Options:\n`,
  ].concat(getOptionsLines(handler.options)).concat([``])

  const lines = [
    ``,
    handler.usage ? `Usage: ${handler.usage}\n` : null,
  ]
  .concat(optionsLines)
  .filter(a => a !== null && a !== undefined)

  lines.forEach(line => {
    console.log(`${pad}${line}`)
  })
}
