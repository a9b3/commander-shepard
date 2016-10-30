const pad = `  `

function formatHelpStr(options) {
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

export function help({ pkgInfo, handlers, globalOptions, usage, description, extraInHelpMenu }) {
  const handlersLines = handlers && Object.keys(handlers).length && [
    `Commands:\n`,
  ].concat(formatHelpStr(handlers)).concat([``])

  const globalOptionsLines = globalOptions && Object.keys(globalOptions).length && [
    `Global Options:\n`,
  ].concat(formatHelpStr(globalOptions)).concat([``])

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
  if (extraInHelpMenu) {
    console.log(extraInHelpMenu)
  }
}

export function detailedHelp({ handler }) {
  const optionsLines = handler.options && Object.keys(handler.options).length && [
    `Options:\n`,
  ].concat(formatHelpStr(handler.options)).concat([``])

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
