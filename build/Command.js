'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Command = function () {

  /*
   * {
   *   required: true,
   *   keys: ['b', 'foo-flag'],
   *   description: '',
   * }
   */
  function Command() {
    var _this = this;

    var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, Command);
    this.parent = null;
    this.subcommands = {};
    this.key = '';

    this.handler = function () {};

    this.longDescription = '';
    this.shortDescription = '';
    this.flags = [];
    this.commands = [];

    this.runHandler = function () {
      var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(_ref) {
        var flags = _ref.flags,
            commands = _ref.commands;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(flags.h || flags.help)) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt('return', _this.help());

              case 2:

                _this._checkFlags(flags);
                _this._checkCommands(commands);

                return _context.abrupt('return', _this.handler({ flags: flags, commands: commands }));

              case 5:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, _this);
      }));

      return function (_x2) {
        return _ref2.apply(this, arguments);
      };
    }();

    this.key = opt.key;
    this.handler = opt.handler || this.handler;
    this.longDescription = opt.longDescription;
    this.shortDescription = opt.shortDescription;
    this.parent = opt.parent;
    this.flags = opt.flags || this.flags;
    this.commands = opt.commands || this.commands;
  }

  /*
   * {
   *   required: true,
   *   key: 'hi',
   *   description: '',
   * }
   */


  (0, _createClass3.default)(Command, [{
    key: '_checkFlags',
    value: function _checkFlags() {
      var flags = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      for (var i = 0; i < this.flags.length; i++) {
        var cursorFlag = this.flags[i];

        if (!cursorFlag.required) {
          continue;
        }

        var containsFlag = cursorFlag.keys.some(function (key) {
          return Boolean(flags[key]);
        });
        if (!containsFlag) {
          throw new Error('required flag \'' + cursorFlag.keys.join(' or ') + '\' missing');
        }
      }
    }
  }, {
    key: '_checkCommands',
    value: function _checkCommands() {
      var commands = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      for (var i = 0; i < this.commands.length; i++) {
        var cursorCommand = this.commands[i];

        if (!cursorCommand.required) {
          continue;
        }

        if (!Boolean(commands[i])) {
          throw new Error('required argument \'' + cursorCommand.key + '\' missing');
        }
      }
    }
  }, {
    key: 'help',
    value: function help() {
      console.log('');

      if (this.longDescription) {
        console.log('  ' + this.longDescription);
        console.log('');
      }

      var keys = [].concat(helpText.generateLine(this)).concat(helpText.generateCommandText(this.commands)).concat(helpText.generateFlagText(this.flags));
      console.log('  ' + _chalk2.default.bold('Usage:') + ' ' + keys.join(' '));

      var paddingSize = helpText.subheader.calculateLeftPadding({ subcommands: this.subcommands, commands: this.commands, flags: this.flags });

      if ((0, _keys2.default)(this.subcommands).length > 0) {
        console.log('');
        console.log(_chalk2.default.bold('  Subcommands:\n'));
        console.log(helpText.subheader.subcommands(this.subcommands, { paddingSize: paddingSize, spacing: 4 }));
      }

      if (this.commands.length > 0) {
        console.log('');
        console.log(_chalk2.default.bold('  Arguments:\n'));
        console.log(helpText.subheader.commands(this.commands, { paddingSize: paddingSize, spacing: 4 }));
      }

      if (this.flags.length > 0) {
        console.log('');
        console.log(_chalk2.default.bold('  Flags:\n'));
        console.log(helpText.subheader.flags(this.flags, { paddingSize: paddingSize, spacing: 4 }));
      }

      console.log('');
    }
  }, {
    key: 'use',
    value: function use(key, command) {
      this.subcommands[key] = command;
      command.parent = this;
      command.key = key;
    }
  }]);
  return Command;
}();

exports.default = Command;


function strWithPadding(str, paddingSize) {
  var padding = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 2;

  return str + ' '.repeat(paddingSize - str.length + padding);
}

var helpText = {
  subheader: {
    calculateLeftPadding: function calculateLeftPadding() {
      var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref3$subcommands = _ref3.subcommands,
          subcommands = _ref3$subcommands === undefined ? {} : _ref3$subcommands,
          _ref3$commands = _ref3.commands,
          commands = _ref3$commands === undefined ? [] : _ref3$commands,
          _ref3$flags = _ref3.flags,
          flags = _ref3$flags === undefined ? [] : _ref3$flags;

      var max = 0;
      (0, _keys2.default)(subcommands).map(function (key) {
        max = key.length > max ? key.length : max;
      });

      commands.forEach(function (f) {
        max = f.key.length > max ? f.key.length : max;
      });

      flags.forEach(function (f) {
        var keys = f.keys.map(function (key) {
          return key.length === 1 ? '-' + key : '--' + key;
        }).join(', ');
        max = keys.length > max ? keys.length : max;
      });
      return max;
    },
    subcommands: function subcommands(_subcommands) {
      var _ref4 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref4$spacing = _ref4.spacing,
          spacing = _ref4$spacing === undefined ? 2 : _ref4$spacing,
          paddingSize = _ref4.paddingSize;

      var commandsHelpText = (0, _keys2.default)(_subcommands).map(function (key) {
        var description = _subcommands[key].shortDescription || '';
        return '' + ' '.repeat(spacing) + strWithPadding(key, paddingSize, 4) + description;
      }).join('\n');

      return commandsHelpText;
    },
    commands: function commands(_commands) {
      var _ref5 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref5$spacing = _ref5.spacing,
          spacing = _ref5$spacing === undefined ? 2 : _ref5$spacing,
          paddingSize = _ref5.paddingSize;

      var argumentsHelpText = _commands.map(function (f) {
        var description = f.shortDescription || '';
        return '' + ' '.repeat(spacing) + strWithPadding(f.key, paddingSize, 4) + description;
      }).join('\n');

      return argumentsHelpText;
    },
    flags: function flags(_flags) {
      var _ref6 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref6$spacing = _ref6.spacing,
          spacing = _ref6$spacing === undefined ? 2 : _ref6$spacing,
          paddingSize = _ref6.paddingSize;

      var flagsText = _flags.map(function (f) {
        var keys = f.keys.map(function (key) {
          return key.length === 1 ? '-' + key : '--' + key;
        }).join(', ');
        var description = f.shortDescription || '';
        return '' + ' '.repeat(spacing) + strWithPadding(keys, paddingSize, 4) + description;
      }).join('\n');

      return flagsText;
    }
  },

  generateFlagText: function generateFlagText(flags) {
    var keys = [];
    var flagText = flags.reduce(function (map, flag) {
      if (flag.required) {
        map.required.push(flag.keys.join('||'));
      } else {
        map.optional.push(flag.keys.join('||'));
      }
      return map;
    }, { required: [], optional: [] });

    if (flagText.required.length > 0) {
      keys.push('<' + flagText.required.join(' ') + '>');
    }
    if (flagText.optional.length > 0) {
      keys.push('[' + flagText.optional.join(' ') + ']');
    }
    return keys;
  },
  generateCommandText: function generateCommandText(commands) {
    return commands.map(function (c) {
      return c.required ? '<' + c.key + '>' : '[' + c.key + ']';
    });
  },
  generateLine: function generateLine(node) {
    var cursorNode = node.parent;
    var keys = cursorNode ? [cursorNode.key] : [];
    while (cursorNode) {
      cursorNode = cursorNode.parent;
      if (cursorNode) {
        keys.unshift(cursorNode.key);
      }
    }
    keys.push(node.key);
    return keys;
  }
};