function strWithPadding(str, paddingSize, padding = 2) {
  return str + ' '.repeat(paddingSize - str.length + padding)
}

export default const helpText = {
  subheader: {
    calculateLeftPadding({ subcommands = {}, commands = [], flags = [] } = {}) {
      let max = 0
      Object.keys(subcommands).map(key => {
        max = key.length > max ? key.length : max
      })

      commands.forEach(f => {
        max = f.key.length > max ? f.key.length : max
      })

      flags.forEach(f => {
        const keys = f.keys.map(key => key.length === 1 ? `-${key}` : `--${key}`).join(', ')
        max = keys.length > max ? keys.length : max
      })
      return max
    },

    subcommands(subcommands, { spacing = 2, paddingSize } = {}) {
      const commandsHelpText = Object.keys(subcommands).map(key => {
        const description = subcommands[key].shortDescription || ''
        return `${' '.repeat(spacing)}${strWithPadding(key, paddingSize, 4)}${description}`
      })
      .join('\n')

      return commandsHelpText
    },

    commands(commands, { spacing = 2, paddingSize } = {}) {
      const argumentsHelpText = commands.map(f => {
        const description = f.shortDescription || ''
        return `${' '.repeat(spacing)}${strWithPadding(f.key, paddingSize, 4)}${description}`
      })
      .join('\n')

      return argumentsHelpText
    },

    flags(flags, { spacing = 2, paddingSize } = {}) {
      const flagsText = flags.map(f => {
        const keys = f.keys.map(key => key.length === 1 ? `-${key}` : `--${key}`).join(', ')
        const description = f.shortDescription || ''
        return `${' '.repeat(spacing)}${strWithPadding(keys, paddingSize, 4)}${description}`
      })
      .join('\n')

      return flagsText
    },
  },

  generateFlagText(flags) {
    let keys = []
    const flagText = flags.reduce((map, flag) => {
      if (flag.required) {
        map.required.push(flag.keys.join('||'))
      } else {
        map.optional.push(flag.keys.join('||'))
      }
      return map
    }, {required: [], optional: []})

    if (flagText.required.length > 0) {
      keys.push(`<${flagText.required.join(' ')}>`)
    }
    if (flagText.optional.length > 0) {
      keys.push(`[${flagText.optional.join(' ')}]`)
    }
    return keys
  },

  generateCommandText(commands) {
    return commands.map(c => c.required ? `<${c.key}>` : `[${c.key}]`)
  },

  generateLine(node) {
    let cursorNode = node.parent
    let keys = cursorNode ? [cursorNode.key] : []
    while(cursorNode) {
      cursorNode = cursorNode.parent
      if (cursorNode) {
        keys.unshift(cursorNode.key)
      }
    }
    keys.push(node.key)
    return keys
  },
}
