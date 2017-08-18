import chalk from 'chalk'
import helpTextFormatter from './helpTextFormatter.js'

export default class Command {
  parent = null
  subcommands = {}

  key = ''
  handler = () => {}
  longDescription = ''
  shortDescription = ''

  /*
   * Format:
   *
   * [{
   *   required: true,
   *   keys: ['b', 'foo-flag'],
   *   description: '',
   * }, ...]
   */
  flags = []

  /*
   * Format:
   *
   * [{
   *   required: true,
   *   key: 'hi',
   *   description: '',
   * }, ...]
   */
  commands = []

  /**
   * @param {!string} key
   * @param {function} handler
   * @param {string} longDescription
   * @param {string} shortDescription
   * @param {Command} parent - parent node
   * @param {array<string>} flags
   * @param {array<function>} commands
   */
  constructor(opt = {}) {
    this.key = opt.key
    this.handler = opt.handler || this.handler
    this.longDescription = opt.longDescription
    this.shortDescription = opt.shortDescription
    this.parent = opt.parent
    this.flags = opt.flags || this.flags
    this.commands = opt.commands || this.commands
  }

  /**
   * Prints info regarding this command eg. subcommands, arguments, flags
   */
  help() {
    console.warn('Deprecated use printHelp() instead')
    this.printHelp()
  }
  printHelp() {
    console.log(``)

    if (this.longDescription) {
      console.log(`  ${this.longDescription}`)
      console.log(``)
    }

    const keys = [].concat(helpTextFormatter.generateLine(this))
      .concat(helpTextFormatter.generateCommandText(this.commands))
      .concat(helpTextFormatter.generateFlagText(this.flags))
    console.log(`  ${chalk.bold('Usage:')} ${keys.join(' ')}`)

    const paddingSize = helpTextFormatter.subheader.calculateLeftPadding({ subcommands: this.subcommands, commands: this.commands, flags: this.flags })

    if (Object.keys(this.subcommands).length > 0) {
      console.log(``)
      console.log(chalk.bold(`  Subcommands:\n`))
      console.log(helpTextFormatter.subheader.subcommands(this.subcommands, { paddingSize, spacing: 4 }))
    }

    if (this.commands.length > 0) {
      console.log(``)
      console.log(chalk.bold(`  Arguments:\n`))
      console.log(helpTextFormatter.subheader.commands(this.commands, { paddingSize, spacing: 4 }))
    }

    if (this.flags.length > 0) {
      console.log(``)
      console.log(chalk.bold(`  Flags:\n`))
      console.log(helpTextFormatter.subheader.flags(this.flags, { paddingSize, spacing: 4 }))
    }

    console.log(``)
  }

  /**
   * Call the handler for this command with the given flags and arguments.
   *
   * @param {array<string>} flags
   * @param {array<string>} commands
   */
  runHandler = async ({ flags, commands }) => {
    if (flags.h || flags.help) {
      return this.help()
    }

    this._validateRuntimeFlags(flags)
    this._validateRuntimeCommands(commands)

    return this.handler({ flags, commands })
  }

  /**
   * Set a subcommand.
   *
   * @param {string} key
   * @param {function} command
   */
  use(key, command) {
    this.subcommands[key] = command
    command.parent = this
    command.key = key
  }

  /*
   * Private instance methods
   */

  _validateRuntimeFlags(flags = {}) {
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

  _validateRuntimeCommands(commands = []) {
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

}
