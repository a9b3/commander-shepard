'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parsePkg = parsePkg;
exports.parseArgv = parseArgv;
exports.requiredKeysInOpt = requiredKeysInOpt;

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parsePkg(pkg) {
  (0, _invariant2.default)(pkg.name, 'Must set \'name\' in package.json');
  (0, _invariant2.default)(pkg.version, 'Must set \'version\' in package.json');
  (0, _invariant2.default)(pkg.bin, 'Must set \'bin\' in package.json');
  (0, _invariant2.default)(Object.keys(pkg.bin)[0], 'Must set a value in \'bin\' in package.json');

  return {
    name: pkg.name,
    version: pkg.version,
    commandName: Object.keys(pkg.bin)[0]
  };
}

// nicer names
function parseArgv(argv) {
  var options = Object.keys(argv).reduce(function (map, key) {
    if (['_'].indexOf(key) !== -1) {
      return map;
    }

    map[key] = argv[key];
    return map;
  }, {});

  return {
    command: argv._[0],
    args: argv._.slice(1, argv._.length),
    options: options
  };
}

/* decorator */
function requiredKeysInOpt(keys) {
  return function (v, key, desc) {
    var og = desc.value;
    desc.value = function (opts) {
      for (var i in keys) {
        (0, _invariant2.default)(opts[keys[i]], '\'opts[' + keys[i] + ']\' must be provided in ' + v.constructor.name + '.' + key);
      }

      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      return og.call.apply(og, [this, opts].concat(args));
    };
    return desc;
  };
}