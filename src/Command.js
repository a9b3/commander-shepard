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
  commands = []

  constructor({
    parent,
    key,
    handler,
    longDescription,
    shortDescription,
    flags,
    commands,
  } = {}) {
    this.key = key
    this.handler = handler || this.handler
    this.longDescription = longDescription
    this.shortDescription = shortDescription
    this.parent = parent
    this.flags = flags || this.flags
    this.commands = commands || this.commands
  }

  checkFlags(flags = {}) {
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

  checkCommands(commands = []) {
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

    let cursorNode = this.parent
    let keys = cursorNode ? [cursorNode.key] : []
    while(cursorNode) {
      cursorNode = cursorNode.parent
      if (cursorNode) {
        keys.unshift(cursorNode.key)
      }
    }
    keys.push(this.key)

    const commandsText = this.commands.map(c => c.required ? `<${c.key}>` : `[${c.key}]`).join(' ')
    const flagText = this.flags.reduce((map, flag) => {
      if (flag.required) {
        map.required.push(flag.keys.join('||'))
      } else {
        map.optional.push(flag.keys.join('||'))
      }
      return map
    }, {required: [], optional: []})

    keys.push(commandsText)
    if (flagText.required.length > 0) {
      keys.push(`<${flagText.required.join(' ')}>`)
    }
    if (flagText.optional.length > 0) {
      keys.push(`[${flagText.optional.join(' ')}]`)
    }
    console.log(`  ${keys.join(' ')}`)

    if (Object.keys(this.subcommands).length > 0) {
      console.log(``)
      console.log(`Subcommands:\n`)
      const commandsHelpText = Object.keys(this.subcommands).map(key => {
        return `  ${key} - ${this.subcommands[key].shortDescription}`
      })
      .join('\n')
      console.log(commandsHelpText)
    }

    if (this.commands.length > 0) {
      console.log(``)
      console.log(`Arguments:\n`)
      const argumentsHelpText = this.commands.map(f => {
        return `  ${f.key} - ${f.shortDescription}`
      })
      .join('\n')
      console.log(argumentsHelpText)
    }

    if (this.flags.length > 0) {
      console.log(``)
      console.log(`Flags:\n`)
      const flagsText = this.flags.map(f => {
        return `  ${f.keys.join(' | ')} - ${f.shortDescription}`
      })
      .join('\n')
      console.log(flagsText)
    }

    console.log(``)
  }

  runHandler = async ({ flags, commands }) => {
    if (flags.h || flags.help) {
      return this.help()
    }

    this.checkFlags(flags)
    this.checkCommands(commands)

    return this.handler({ flags, commands })
  }

  use(key, command) {
    this.subcommands[key] = command
    command.parent = this
    command.key = key
  }
}

