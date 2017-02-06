function parseArgv() {
  const argv = require('yargs').argv
  return {
    flags: argv,
    commands: argv._,
  }
}

function paddedStr(col, col2, leftMaxStrLength = 0) {
  col.forEach(s => {
    if (s.length > leftMaxStrLength) {
      leftMaxStrLength = s.length
    }
  })

  leftMaxStrLength += 5

  return col.map((s, i) => {
    const spacing = leftMaxStrLength - s.length
    return `${s}${' '.repeat(spacing)}${col2[i]}`
  })
}

export default class Commander {
  configs = {}
  flags = {}

  constructor() {

  }

  configure(configs) {
    this.configs = configs
    this.configs.flags = (this.configs.flags || []).concat([
      {
        keys: ['h', 'help'],
        shortDescription: 'show help',
      },
      {
        keys: ['v', 'version'],
        shortDescription: 'show version',
      },
    ])
    const { flags } = parseArgv()
    this.flags = flags
  }

  getCommandNode(keys) {
    const keysCopy = keys.slice()
    let cursor = this.configs
    let key = keysCopy.shift()
    const keysFound = []

    while(cursor) {
      let keyFound = false

      for (let i = 0; i < (cursor.subcommands || []).length; i++) {
        if (cursor.subcommands[i].key === key) {
          cursor = cursor.subcommands[i]
          keyFound = true
          keysFound.push(key)
          key = keysCopy.shift()
          break
        }
      }

      if (!keyFound) {
        break
      }
    }

    return {
      node: cursor,
      commandKeys: keysFound,
      args: keysCopy,
    }
  }

  help(keys = []) {
    const { node: commandNode, commandKeys } = this.getCommandNode(keys)

    const flagDisplayLines = (commandNode.flags || []).length > 0 && `\n Flags:\n\n` + paddedStr(
      commandNode.flags.map(flag => {
        return flag.keys.map(key => key.length > 1 ? `--${key}` : `-${key}`).join(' ')
      }),
      commandNode.flags.map(flag => `${flag.required ? '[required] ' : ''}${flag.shortDescription}`),
    ).map(s => `   ${s}`).join('\n')

    const commandDisplayLines = (commandNode.subcommands || []).length > 0 && `\n Commands:\n\n` + paddedStr(
      (commandNode.subcommands || []).map(command => command.key),
      (commandNode.subcommands || []).map(command => `${command.shortDescription}`),
    ).map(s => `   ${s}`).join('\n')

    if (commandNode.longDescription) {
      console.log(
        `\n`,
        `${commandNode.longDescription}`,
      )
    }
    console.log(
      `\n`,
      `Usage: ${this.configs.key + ' '}${commandKeys.length === 0 ? '' : commandKeys.join(' ')} ${commandDisplayLines ? '[command]' : ''} ${flagDisplayLines ? '[flags]' : ''}`,
      `\n`,
      flagDisplayLines ? flagDisplayLines + '\n' : '',
      commandDisplayLines ? commandDisplayLines  + '\n': '',
    )
  }

  version() {
    console.log(
      `\n`,
      `${this.configs.package.name} ${this.configs.package.version}`,
      `\n`,
    )
  }

  execute() {
    const { flags, commands } = parseArgv()

    // handle special case -h --help
    if (flags.h || flags.help) {
      this.help(commands)
    } else if (flags.v || flags.version) {
      this.version()
    } else {
      const { node: commandNode, args } = this.getCommandNode(commands)
      if (!commandNode || !commandNode.command) {
        if (commands.length === 0) {
          return this.help(commands)
        }
        throw new Error(`${commands.join(' ')} is not a valid command`)
      }
      // TODO add arg checking here, for required flags and args
      commandNode.command({ args, flags })
    }
  }
}
