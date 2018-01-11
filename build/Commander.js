'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _Command2 = require('./Command.js');

var _Command3 = _interopRequireDefault(_Command2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Commander = function (_Command) {
  (0, _inherits3.default)(Commander, _Command);

  function Commander(opt) {
    (0, _classCallCheck3.default)(this, Commander);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Commander.__proto__ || (0, _getPrototypeOf2.default)(Commander)).call(this, opt));

    _this.packageJson = {};

    _this.configure(opt);
    _this.runtimeData = parseArgv();
    return _this;
  }

  /**
   * @param {object} packageJson
   */


  (0, _createClass3.default)(Commander, [{
    key: 'configure',
    value: function configure() {
      var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (opt.package) {
        console.warn('Deprecated use packageJson field');
      }
      this.packageJson = opt.packageJson || opt.package;
    }

    /**
     * Prints the version number.
     */

  }, {
    key: 'version',
    value: function version() {
      console.warn('Deprecated use printVersion instead');this.printVersion();
    }
  }, {
    key: 'printVersion',
    value: function printVersion() {
      console.log(this.packageJson.version);
    }

    /**
     * Call .catch on this to display errors.
     */

  }, {
    key: 'start',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
        var _parseArgv, flags, commands, _findCommandNode2, commandNode, remainingCommands;

        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _parseArgv = parseArgv(), flags = _parseArgv.flags, commands = _parseArgv.commands;

                if (!(flags.v || flags.version)) {
                  _context.next = 3;
                  break;
                }

                return _context.abrupt('return', this.printVersion());

              case 3:
                _findCommandNode2 = this._findCommandNode(commands), commandNode = _findCommandNode2.commandNode, remainingCommands = _findCommandNode2.remainingCommands;
                _context.next = 6;
                return commandNode.runHandler({ flags: flags, commands: remainingCommands });

              case 6:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function start() {
        return _ref.apply(this, arguments);
      }

      return start;
    }()

    /*
     * Private instance methods
     */

    /**
     * Traverse down tree and find the last corresponding node.
     *
     * @param {array<string>} _commands
     * @returns {object}
     * {
     *   commandNode: Command,
     *   remainingCommands: array<string>,
     * }
     */

  }, {
    key: '_findCommandNode',
    value: function _findCommandNode(_commands) {
      var commands = _commands.slice();

      var cursorKey = commands.shift();
      var cursorCommand = this;

      while (cursorCommand.subcommands[cursorKey]) {
        cursorCommand = cursorCommand.subcommands[cursorKey];
        cursorKey = commands.shift();
      }

      if (cursorKey) {
        commands.unshift(cursorKey);
      }

      return {
        commandNode: cursorCommand,
        remainingCommands: commands
      };
    }
  }]);
  return Commander;
}(_Command3.default);

exports.default = Commander;


function parseArgv() {
  var argv = require('yargs').argv;
  return {
    flags: argv,
    commands: argv._
  };
}