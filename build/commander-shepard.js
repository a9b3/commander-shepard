'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _getOwnPropertyDescriptor = require('babel-runtime/core-js/object/get-own-property-descriptor');

var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _dec, _desc, _value, _class;

var _helper = require('./helper.js');

var helper = _interopRequireWildcard(_helper);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _printer = require('./printer.js');

var printer = _interopRequireWildcard(_printer);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

var argv = require('yargs').argv;
var Commander = (_dec = helper.requiredKeysInOpt(['name', 'command']), (_class = function () {

  /* set by this.add() */
  function Commander(_ref) {
    var pkg = _ref.pkg,
        usage = _ref.usage,
        description = _ref.description,
        globalOptions = _ref.globalOptions,
        extraInHelpMenu = _ref.extraInHelpMenu,
        command = _ref.command;
    (0, _classCallCheck3.default)(this, Commander);
    this.command = null;
    this.args = [];
    this.options = {};
    this.usage = null;
    this.pkgInfo = {
      name: null,
      version: null,
      commandName: null
    };
    this.description = null;
    this.handlers = {};
    this.globalOptions = {};

    /* requires parsing */
    this.pkgInfo = pkg && helper.parsePkg(pkg);

    // parsed command line arguments
    var parsedArgs = helper.parseArgv(argv);
    this.command = parsedArgs.command;
    this.args = parsedArgs.args;
    this.options = parsedArgs.options;

    /* from constructor */
    this.usage = usage;
    this.description = description;
    this.globalOptions = globalOptions || {};
    this.globalOptions['help'] = {
      names: ['--help', '-h'],
      help: 'show help for commands'
    };

    if (command) {
      this.handlers['__default'] = { command: command };
    }

    this._setUpHelpCommand(extraInHelpMenu);
  }

  /* optional metadata */


  (0, _createClass3.default)(Commander, [{
    key: '_setUpHelpCommand',
    value: function _setUpHelpCommand(extraInHelpMenu) {
      var _this = this;

      this.add({
        name: 'help',
        help: 'show help',
        command: function command() {
          printer.help({
            pkgInfo: _this.pkgInfo,
            handlers: _this.handlers,
            globalOptions: _this.globalOptions,
            usage: _this.usage,
            description: _this.description,
            extraInHelpMenu: extraInHelpMenu
          });
        }
      });
    }
  }, {
    key: 'add',
    value: function add(opts) {
      (0, _invariant2.default)(!this.handlers[opts.name], '\'' + opts.name + '\' was already defined.');
      this.handlers[opts.name] = opts;
    }
  }, {
    key: '_checkRequiredOptions',
    value: function _checkRequiredOptions() {
      var required = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var re = /^-+(.*)/;

      (0, _keys2.default)(required).forEach(function (key) {
        var option = required[key];
        if (!option.required) {
          return;
        }

        var withoutDashNames = (option.names || [option.name]).map(function (name) {
          return re.exec(name)[1];
        });
        if (!withoutDashNames.some(function (name) {
          return options[name];
        })) {
          throw new Error('Required option ' + (option.name || option.names.join(', ')) + ' not specified');
        }
      });
    }
  }, {
    key: 'start',
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
        var handler;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;

                if (!(this.command && !this.handlers[this.command])) {
                  _context.next = 3;
                  break;
                }

                throw new Error('Command does not exist');

              case 3:
                if (!(this.options['help'] || this.options['h'] || this.command === 'help')) {
                  _context.next = 5;
                  break;
                }

                return _context.abrupt('return', this.handlers['help'].command());

              case 5:
                handler = this.handlers[this.command];

                if (handler) {
                  _context.next = 14;
                  break;
                }

                if (!this.handlers['__default']) {
                  _context.next = 13;
                  break;
                }

                this._checkRequiredOptions(this.globalOptions, this.options);
                this._checkRequiredOptions(this.handlers['__default'].options, this.options);
                return _context.abrupt('return', this.handlers['__default'].command({ args: this.args, options: this.options }));

              case 13:
                return _context.abrupt('return', this.handlers['help'].command());

              case 14:
                if (!(this.options['help'] || this.options['h'])) {
                  _context.next = 16;
                  break;
                }

                return _context.abrupt('return', printer.detailedHelp({ handler: handler }));

              case 16:

                this._checkRequiredOptions(this.globalOptions, this.options);
                this._checkRequiredOptions(handler.options, this.options);

                _context.next = 20;
                return handler.command({
                  args: this.args,
                  options: this.options
                });

              case 20:
                _context.next = 25;
                break;

              case 22:
                _context.prev = 22;
                _context.t0 = _context['catch'](0);

                console.log(_chalk2.default.red(_context.t0.message));

              case 25:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 22]]);
      }));

      function start() {
        return _ref2.apply(this, arguments);
      }

      return start;
    }()
  }]);
  return Commander;
}(), (_applyDecoratedDescriptor(_class.prototype, 'add', [_dec], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'add'), _class.prototype)), _class));
exports.default = Commander;