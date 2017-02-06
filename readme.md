# Commander Shepard

```sh
yarn add commander-shepard --save
```

## Usage

```js
import CommanderShepard from 'commander-shepard'

const commander = new CommanderShepard()
commander.configure({
  key: `foo`,
  package: require('./package.json'),
  flags: [
    {
      keys: ['h', 'help'],
      required: false,
      shortDescription: 'Displays help',
    },
    {
      keys: ['v', 'version'],
      required: true,
      shortDescription: 'Displays version',
    },
  ],
  subcommands: [
    {
      key: 'bar',
      shortDescription: 'short description',
      longDescription: 'blahblahblah',
      flags: [
        {
          keys: ['b'],
          required: true,
          shortDescription: 'f ok',
        },
      ],
      command: () => {
        console.log(`called foo`)
      },
      subcommands: [
        {
          key: 'zed',
          shortDescription: 'short description',
          longDescription: 'cool stuff',
          command: () => {
            console.log(`called bar`)
          },
        },
        {
          key: 'zed',
          shortDescription: 'zed',
          command: () => {
            console.log(`called bar`)
          },
        },
      ],
    },
  ]
})
commander.execute()
```

A tree structure is used to define the commands. Each command node looks something like this. Each subcommand has the same structure as this.

```js
{
	key: 'foo',
	shortDescription: '',
	longDescription: '',
	command: (flags, args) => {},
	flags: [],
	subcommands: [],
}
```

Each flag object looks like this.

```js
{
	keys: ['h', 'help'],
	required: true,
	shortDescription: 'Displays help for give command',
}
```

Only the top level command requires some extra fields.

```
{
	package: require('./package.json'),
}
```