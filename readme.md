# Commander Shepard

Framework for building command line tools.

```sh
yarn add commander-shepard --save
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
<br />
<hr/>
<br />

## API

### Constructor

Field | Type | Description
--- | --- | ---
pkg | `JSON` | `require('./package.json')`
usage | `String` | Example usage of this cli
description | `String` | A Description of the cli
globalOptions | `Object` | Map of options objects

### - add

add accepts a config object with the following signature.

Field | Type | Description
--- | --- | ---
name | `String` | Name of the command same as the key to invoke command
usage | `String` | Example usage of command
detailedHelp | `String` | Extra help is shown when command is used with `--help` flag
help | `String` | String to show in global help menu
options | `Object` | Map of options objects
command | `Function` | The actual function to run when this command is called

### - start

Call start after configuring the commander instance to actually run the commands against the invocation of the command line tool.

<br />
<hr/>
<br />


## option

An option has this shape, this object can be passed into globalOptions or used on command options.

Field | Type | Description
--- | --- | ---
name | `String` | Name of the option something like this `--foo` or `-f`
names | `Array<String>` | Same as name except an array. `['--foo', '-f']`
help | `String` | Text to show up in help menu
required | `Boolean` | Whether this flag is required or not

## command

The command function will be passed `{ options, args }` that the command is invoked with.

Example.

If command was invoked like this ...

```sh
foo bar --name joe arg1 arg2
```

... then the arguments passed to the bar command will be.

```js
{
	options: { name: 'joe' },
	args: ['arg1', 'arg2'],
}
```