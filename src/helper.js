import invariant from 'invariant'

export function parsePkg(pkg) {
  invariant(pkg.name, `Must set 'name' in package.json`)
  invariant(pkg.version, `Must set 'version' in package.json`)
  invariant(pkg.bin, `Must set 'bin' in package.json`)
  invariant(Object.keys(pkg.bin)[0], `Must set a value in 'bin' in package.json`)

  return {
    name: pkg.name,
    version: pkg.version,
    commandName: Object.keys(pkg.bin)[0],
  }
}

// nicer names
export function parseArgv(argv) {
  const options = Object.keys(argv).reduce((map, key) => {
    if (['_'].indexOf(key) !== -1) {
      return map
    }

    map[key] = argv[key]
    return map
  }, {})

  return {
    command: argv._[0],
    args: argv._.slice(1, argv._.length),
    options,
  }
}

/* decorator */
export function requiredKeysInOpt(keys) {
  return function(v, key, desc) {
    const og = desc.value
    desc.value = function(opts, ...args) {
      for (let i in keys) {
        invariant(opts[keys[i]], `'opts[${keys[i]}]' must be provided in ${v.constructor.name}.${key}`)
      }

      return og.call(this, opts, ...args)
    }
    return desc
  }
}
