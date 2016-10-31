const argv = require('yargs').argv
import * as helper from './helper.js'
import invariant from 'invariant'
import * as printer from './printer.js'

export default class Commander {
  command = null
  usage = null
  args = []
  options = {}
  pkgInfo = {
    name: null,
    version: null,
    commandName: null,
  }
  description = null

  /* set by this.add() */
  handlers = {}
  globalOptions = {}

  constructor({ pkg, usage, description, globalOptions, extraInHelpMenu }) {
    /* requires parsing */
    this.pkgInfo = helper.parsePkg(pkg)
    const { command, args, options } = helper.parseArgv(argv)
    this.command = command
    this.args = args
    this.options = options

    /* from constructor */
    this.usage = usage
    this.description = description
    this.globalOptions = globalOptions || {}
    this.globalOptions['help'] = {
      names: ['--help', '-h'],
      help: 'show help for commands',
    }

    this._setUpHelpCommand(extraInHelpMenu)
  }

  _setUpHelpCommand(extraInHelpMenu) {
    this.add({
      name: 'help',
      help: 'show help',
      command: () => {
        printer.help({
          pkgInfo: this.pkgInfo,
          handlers: this.handlers,
          globalOptions: this.globalOptions,
          usage: this.usage,
          description: this.description,
          extraInHelpMenu,
        })
      },
    })
  }

  @helper.requiredKeysInOpt(['name', 'command'])
  add(opts) {
    invariant(!this.handlers[opts.name], `'${opts.name}' was already defined.`)
    this.handlers[opts.name] = opts
  }

  _checkRequiredOptions(required = {}, options = {}) {
    const re = /^-+(.*)/

    Object.keys(required).forEach(key => {
      const option = required[key]
      if (!option.required) {
        return
      }

      const withoutDashNames = (option.names || [option.name]).map(name => re.exec(name)[1])
      if (!withoutDashNames.some(name => options[name])) {
        throw new Error(`Required option ${option.name || option.names.join(', ')} not specified`)
      }
    })
  }

  async start() {
    try {
      const handler = this.handlers[this.command]
      if (!handler || ['help'].indexOf(this.command) !== -1) {
        return handler ? handler.command() : this.handlers['help'].command()
      }

      // special case command --help show detailed help for command
      if (this.options['help'] || this.options['h']) {
        return printer.detailedHelp({ handler })
      }

      this._checkRequiredOptions(this.globalOptions, this.options)
      this._checkRequiredOptions(handler.options, this.options)

      await handler.command({
        args: this.args,
        options: this.options,
      })
    } catch (e) {
      console.log(e.toString())
    }
  }
}
