import Command from './Command.js'

export default class Commander extends Command {
  package = {}

  constructor(opt) {
    super(opt)
    this.configure(opt)
  }

  configure(opt = {}) {
    this.package = opt.package
  }

  version() {
    console.log(this.package.version)
  }

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

  /**
   * Call .catch on this to display errors
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
}

function parseArgv() {
  const argv = require('yargs').argv
  return {
    flags: argv,
    commands: argv._,
  }
}
