import {
  Commander,
  Command,
} from '../src/index.js'

const commander = new Commander({
  key: 'commander',
  package: require('../package.json'),
  longDescription: 'this is the commander',
  handler: ({ commands }) => {
    // do something
  },
  flags: [
    {
      required: true,
      keys: ['f', 'foo-flag'],
      description: 'f flag description',
    },
  ],
  commands: [
    {
      required: true,
      key: 'foo argument',
      description: 'required first arg',
    },
  ],
})

const fooSubcommand = new Command({
  handler: async ({ commands }) => {
    // do something
  },
})
fooSubcommand.use('bar', new Command({
  handler: ({ commands }) => {
    // do something
  },
}))
commander.use('foo', fooSubcommand)

commander.start()
.catch((e) => {
  console.error('error', e.message)
})
