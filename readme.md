# Commander Shepard

```sh
yarn add commander-shepard --save
```

## Usage

```js
import { Commander, Command } from 'commander-shepard'

const commander = new Commander({
  key: 'commander',
  package: require('../package.json'),
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
commander.use('foo', hiHandler)

commander.start()
.catch((e) => {
  console.error('error', e.message)
})
```