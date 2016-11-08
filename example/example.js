import CommanderShepard from '../src/commander-shepard.js'

const commander = new CommanderShepard({
  usage: `testing [command] [flags]`,
  globalOptions: {
    config: {
      name: '--config',
      help: 'file path of the configuration',
      required: true,
    },
  },
  command: () => {
    console.log(`hi`)
  },
})

commander.start()
