'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Commander = function () {
  function Commander(configs) {
    (0, _classCallCheck3.default)(this, Commander);
    this.configs = {};
    this.flags = {};

    if (configs) {
      this.configure(configs);
    }
  }

  (0, _createClass3.default)(Commander, [{
    key: 'configure',
    value: function configure(configs) {
      this.configs = configs;
      this.configs.flags = (this.configs.flags || []).concat([{
        keys: ['h', 'help'],
        shortDescription: 'show help'
      }, {
        keys: ['v', 'version'],
        shortDescription: 'show version'
      }]);

      var _parseArgv = parseArgv(),
          flags = _parseArgv.flags;

      this.flags = flags;
    }
  }, {
    key: 'getCommandNode',
    value: function getCommandNode(keys) {
      var keysCopy = keys.slice();
      var cursor = this.configs;
      var keysFound = [];
      var requiredFlags = [];

      while (cursor) {
        var keyFound = false;
        requiredFlags = requiredFlags.concat((cursor.flags || []).map(function (f) {
          return f.required && f;
        }).filter(function (a) {
          return a;
        }));

        for (var i = 0; i < (cursor.subcommands || []).length; i++) {
          if (cursor.subcommands[i].key === keysCopy[0]) {
            cursor = cursor.subcommands[i];
            keyFound = true;
            keysFound.push(keysCopy[0]);
            keysCopy.shift();
            break;
          }
        }

        if (!keyFound) {
          break;
        }
      }

      return {
        node: cursor,
        commandKeys: keysFound,
        args: keysCopy,
        requiredFlags: requiredFlags
      };
    }
  }, {
    key: 'help',
    value: function help() {
      var keys = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      var _getCommandNode = this.getCommandNode(keys),
          commandNode = _getCommandNode.node,
          commandKeys = _getCommandNode.commandKeys;

      var flagDisplayLines = (commandNode.flags || []).length > 0 && '\n Flags:\n\n' + paddedStr(commandNode.flags.map(function (flag) {
        return flag.keys.map(function (key) {
          return key.length > 1 ? '--' + key : '-' + key;
        }).join(' ');
      }), commandNode.flags.map(function (flag) {
        return '' + (flag.required ? '[required] ' : '') + flag.shortDescription;
      })).map(function (s) {
        return '   ' + s;
      }).join('\n');

      var commandDisplayLines = (commandNode.subcommands || []).length > 0 && '\n Commands:\n\n' + paddedStr((commandNode.subcommands || []).map(function (command) {
        return command.key;
      }), (commandNode.subcommands || []).map(function (command) {
        return '' + command.shortDescription;
      })).map(function (s) {
        return '   ' + s;
      }).join('\n');

      if (commandNode.longDescription) {
        console.log('\n', '' + commandNode.longDescription);
      }

      console.log('\n', 'Usage: ' + (this.configs.key + ' ') + (commandKeys.length === 0 ? '' : commandKeys.join(' ')) + (commandNode.requiredArgs ? ' ' + commandNode.requiredArgs.join(' ') : '') + ' ' + (commandDisplayLines ? '[command]' : '') + ' ' + (flagDisplayLines ? '[flags]' : ''), '\n', flagDisplayLines ? flagDisplayLines + '\n' : '', commandDisplayLines ? commandDisplayLines + '\n' : '');
    }
  }, {
    key: 'version',
    value: function version() {
      console.log('\n', this.configs.package.name + ' ' + this.configs.package.version, '\n');
    }
  }, {
    key: 'execute',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
        var _this = this;

        var _ret;

        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                return _context2.delegateYield(_regenerator2.default.mark(function _callee() {
                  var _parseArgv2, flags, commands, _getCommandNode2, commandNode, args, requiredFlags, missingRequiredFlags;

                  return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          _parseArgv2 = parseArgv(), flags = _parseArgv2.flags, commands = _parseArgv2.commands;

                          // handle special case -h --help

                          if (!(flags.h || flags.help)) {
                            _context.next = 5;
                            break;
                          }

                          _this.help(commands);
                          _context.next = 19;
                          break;

                        case 5:
                          if (!(flags.v || flags.version)) {
                            _context.next = 9;
                            break;
                          }

                          _this.version();
                          _context.next = 19;
                          break;

                        case 9:
                          _getCommandNode2 = _this.getCommandNode(commands), commandNode = _getCommandNode2.node, args = _getCommandNode2.args, requiredFlags = _getCommandNode2.requiredFlags;

                          // Handle missing required flags

                          missingRequiredFlags = requiredFlags.map(function (r) {
                            if (!r.keys.some(function (key) {
                              return flags[key];
                            })) {
                              return r.keys;
                            }
                          }).filter(function (a) {
                            return a;
                          });

                          if (!(missingRequiredFlags.length > 0)) {
                            _context.next = 13;
                            break;
                          }

                          throw new Error('Missing required flags [' + missingRequiredFlags.join(', ') + '].');

                        case 13:
                          if (!(!commandNode || !commandNode.command)) {
                            _context.next = 17;
                            break;
                          }

                          if (!(commands.length === 0)) {
                            _context.next = 16;
                            break;
                          }

                          return _context.abrupt('return', {
                            v: _this.help(commands)
                          });

                        case 16:
                          throw new Error(commands.join(' ') + ' is not a valid command');

                        case 17:
                          _context.next = 19;
                          return commandNode.command({ args: args, flags: flags });

                        case 19:
                        case 'end':
                          return _context.stop();
                      }
                    }
                  }, _callee, _this);
                })(), 't0', 2);

              case 2:
                _ret = _context2.t0;

                if (!((typeof _ret === 'undefined' ? 'undefined' : (0, _typeof3.default)(_ret)) === "object")) {
                  _context2.next = 5;
                  break;
                }

                return _context2.abrupt('return', _ret.v);

              case 5:
                _context2.next = 10;
                break;

              case 7:
                _context2.prev = 7;
                _context2.t1 = _context2['catch'](0);

                console.log((_context2.t1 || {}).message || '');

              case 10:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[0, 7]]);
      }));

      function execute() {
        return _ref.apply(this, arguments);
      }

      return execute;
    }()
  }]);
  return Commander;
}();

exports.default = Commander;


function parseArgv() {
  var argv = require('yargs').argv;
  return {
    flags: argv,
    commands: argv._
  };
}

function paddedStr(col, col2) {
  var leftMaxStrLength = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

  col.forEach(function (s) {
    if (s.length > leftMaxStrLength) {
      leftMaxStrLength = s.length;
    }
  });

  leftMaxStrLength += 5;

  return col.map(function (s, i) {
    var spacing = leftMaxStrLength - s.length;
    return '' + s + ' '.repeat(spacing) + col2[i];
  });
}