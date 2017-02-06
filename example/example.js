import Commander from '../src/index.js'

const commander = new Commander()
commander.configure({
  key: `foo`,
  package: {
    name: 'test',
    version: '1.0.0',
  },
  command: (args, flags) => {
    console.log(`args`, args, flags)
  },
  flags: [
    {
      keys: ['h', 'help'],
      required: false,
      shortDescription: 'hi',
    },
    {
      keys: ['foo'],
      required: true,
      shortDescription: 'hoo',
    },
    {
      keys: ['super-long-key'],
      required: true,
      shortDescription: 'hoo',
    },
  ],
  subcommands: [
    {
      key: 'foo',
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
          key: 'bar',
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
    {
      key: 'zed',
      shortDescription: 'zed',
      command: () => {

      },
    },
  ]
})
commander.execute()
