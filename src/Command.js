import chalk from 'chalk'

export default class Command {
  parent = null
  subcommands = {}

  key = ''
  handler = () => {}
  longDescription = ''
  shortDescription = ''

  /*
   * {
   *   required: true,
   *   keys: ['b', 'foo-flag'],
   *   description: '',
   * }
   */
  flags = []

  /*
   * {
   *   required: true,
   *   key: 'hi',
   *   description: '',
   * }
   */
  commands = []

  constructor(opt = {}) {
    this.key = opt.key
    this.handler = opt.handler || this.handler
    this.longDescription = opt.longDescription
    this.shortDescription = opt.shortDescription
    this.parent = opt.parent
    this.flags = opt.flags || this.flags
    this.commands = opt.commands || this.commands
  }

  _checkFlags(flags = {}) {
    for (let i = 0; i < this.flags.length; i++) {
      const cursorFlag = this.flags[i]

      if (!cursorFlag.required) {
        continue
      }

      const containsFlag = cursorFlag.keys.some(key => Boolean(flags[key]))
      if (!containsFlag) {
        throw new Error(`required flag '${cursorFlag.keys.join(' or ')}' missing`)
      }
    }
  }

  _checkCommands(commands = []) {
    for (let i = 0; i < this.commands.length; i++) {
      const cursorCommand = this.commands[i]

      if (!cursorCommand.required) {
        continue
      }

      if (!Boolean(commands[i])) {
        throw new Error(`required argument '${cursorCommand.key}' missing`)
      }
    }
  }

  help() {
    console.log(``)

    if (this.longDescription) {
      console.log(`  ${this.longDescription}`)
      console.log(``)
    }

    const keys = [].concat(helpText.generateLine(this))
      .concat(helpText.generateCommandText(this.commands))
      .concat(helpText.generateFlagText(this.flags))
    console.log(`  ${chalk.bold('Usage:')} ${keys.join(' ')}`)

    const paddingSize = helpText.subheader.calculateLeftPadding({ subcommands: this.subcommands, commands: this.commands, flags: this.flags })

    if (Object.keys(this.subcommands).length > 0) {
      console.log(``)
      console.log(chalk.bold(`  Subcommands:\n`))
      console.log(helpText.subheader.subcommands(this.subcommands, { paddingSize, spacing: 4 }))
    }

    if (this.commands.length > 0) {
      console.log(``)
      console.log(chalk.bold(`  Arguments:\n`))
      console.log(helpText.subheader.commands(this.commands, { paddingSize, spacing: 4 }))
    }

    if (this.flags.length > 0) {
      console.log(``)
      console.log(chalk.bold(`  Flags:\n`))
      console.log(helpText.subheader.flags(this.flags, { paddingSize, spacing: 4 }))
    }

    console.log(``)
  }

  runHandler = async ({ flags, commands }) => {
    if (flags.h || flags.help) {
      return this.help()
    }

    this._checkFlags(flags)
    this._checkCommands(commands)

    return this.handler({ flags, commands })
  }

  use(key, command) {
    this.subcommands[key] = command
    command.parent = this
    command.key = key
  }
}

function strWithPadding(str, paddingSize, padding = 2) {
  return str + ' '.repeat(paddingSize - str.length + padding)
}

const helpText = {
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
