# Commander Shepard

Framework for building command line tools.

```sh
yarn add commander-shepard --dev
```

## Usage

```js
import CommanderShepard from 'commander-shepard'

const pkg = require('../package.json')
const binName = Object.keys(pkg.bin)[0]
const commander = new CommanderShepard({
  pkg,
  usage: `${binName} [command] [flags]`,
  description: `Use to do awesome things.`,
  globalOptions: {
    'required': {
      name: '-r',
      help: 'required for no reason',
      required: true,
    },
  },
})

commander.add({
  name: 'foo',
  usage: `${binName} foo [options]`,
  detailedHelp: `This is a command that requires more options!`,
  help: 'This is a command!',
  options: {
    'yo': {
      names: ['--yo', '-y'],
      required: true,
    },
  },
  command: ({ options, args }) => {
	console.log('wow! cool!')
  },
})

commander.start()
```