import Command from './Command.js'

export default class Commander extends Command {
  packageJson = {}

  constructor(opt) {
    super(opt)
    this.configure(opt)
  }

  /**
   * @param {object} packageJson
   */
  configure(opt = {}) {
    if (opt.package) {
      console.warn('Deprecated use packageJson field')
    }
    this.packageJson = opt.packageJson || opt.package
  }

  /**
   * Prints the version number.
   */
  version() {console.warn('Deprecated use printVersion instead'); this.printVersion()}
  printVersion() {
    console.log(this.packageJson.version)
  }

  /**
   * Call .catch on this to display errors.
   */
  async start() {
    const {
      flags,
      commands,
    } = parseArgv()

    if (flags.v || flags.version) {
      return this.version()
    }

    const {
      commandNode,
      remainingCommands,
    } = this._findCommandNode(commands)

    await commandNode.runHandler({ flags, commands: remainingCommands })
  }

  /*
   * Private instance methods
   */

  /**
   * Traverse down tree and find the last corresponding node.
   *
   * @param {array<string>} _commands
   * @returns {object}
   * {
   *   commandNode: Command,
   *   remainingCommands: array<string>,
   * }
   */
  _findCommandNode(_commands) {
    const commands = _commands.slice()

    let cursorKey = commands.shift()
    let cursorCommand = this

    while(cursorCommand.subcommands[cursorKey]) {
      cursorCommand = cursorCommand.subcommands[cursorKey]
      cursorKey = commands.shift()
    }

    if (cursorKey) {
      commands.unshift(cursorKey)
    }

    return {
      commandNode: cursorCommand,
      remainingCommands: commands,
    }
  }
}

function parseArgv() {
  const argv = require('yargs').argv
  return {
    flags: argv,
    commands: argv._,
  }
}
