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

var _helpTextFormatter = require('./helpTextFormatter.js');

var _helpTextFormatter2 = _interopRequireDefault(_helpTextFormatter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Command = function () {

  /**
   * @param {!string} key - Key to reference this command by, also what it will
   * be called with by the end user.
   * @param {function} handler - Function to run when this command is evoked.
   * @param {string} longDescription
   * @param {string} shortDescription
   * @param {Command} parent - parent node
   * @param {array<string>} flags - Flags accepted by this command.
   * @param {array<function>} commands
   */


  /*
   * Format:
   *
   * [{
   *   required: true,
   *   keys: ['b', 'foo-flag'],
   *   description: '',
   * }, ...]
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
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(_ref) {
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

                return _context.abrupt('return', _this.printHelp());

              case 2:

                _this._validateRuntimeFlags(flags);
                _this._validateRuntimeCommands(commands);

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

  /**
   * Prints info regarding this command eg. subcommands, arguments, flags
   */


  /*
   * Format:
   *
   * [{
   *   required: true,
   *   key: 'hi',
   *   description: '',
   * }, ...]
   */


  (0, _createClass3.default)(Command, [{
    key: 'help',
    value: function help() {
      console.warn('Deprecated use printHelp() instead');
      this.printHelp();
    }
  }, {
    key: 'printHelp',
    value: function printHelp() {
      console.log('');

      if (this.longDescription) {
        console.log('  ' + this.longDescription);
        console.log('');
      }

      var keys = [].concat(_helpTextFormatter2.default.generateLine(this)).concat(_helpTextFormatter2.default.generateCommandText(this.commands)).concat(_helpTextFormatter2.default.generateFlagText(this.flags));
      console.log('  ' + _chalk2.default.bold('Usage:') + ' ' + keys.join(' '));

      var paddingSize = _helpTextFormatter2.default.subheader.calculateLeftPadding({ subcommands: this.subcommands, commands: this.commands, flags: this.flags });

      if ((0, _keys2.default)(this.subcommands).length > 0) {
        console.log('');
        console.log(_chalk2.default.bold('  Subcommands:\n'));
        console.log(_helpTextFormatter2.default.subheader.subcommands(this.subcommands, { paddingSize: paddingSize, spacing: 4 }));
      }

      if (this.commands.length > 0) {
        console.log('');
        console.log(_chalk2.default.bold('  Arguments:\n'));
        console.log(_helpTextFormatter2.default.subheader.commands(this.commands, { paddingSize: paddingSize, spacing: 4 }));
      }

      if (this.flags.length > 0) {
        console.log('');
        console.log(_chalk2.default.bold('  Flags:\n'));
        console.log(_helpTextFormatter2.default.subheader.flags(this.flags, { paddingSize: paddingSize, spacing: 4 }));
      }

      console.log('');
    }

    /**
     * Call the handler for this command with the given flags and arguments.
     *
     * @param {array<string>} flags
     * @param {array<string>} commands
     */

  }, {
    key: 'use',


    /**
     * Set a subcommand.
     *
     * @param {string} key
     * @param {function} command
     */
    value: function use(key, command) {
      this.subcommands[key] = command;
      command.parent = this;
      command.key = key;
    }

    /*
     * Private instance methods
     */

  }, {
    key: '_validateRuntimeFlags',
    value: function _validateRuntimeFlags() {
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
    key: '_validateRuntimeCommands',
    value: function _validateRuntimeCommands() {
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
  }]);
  return Command;
}();

exports.default = Command;