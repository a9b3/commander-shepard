'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _desc, _value, _class;

var _helper = require('./helper.js');

var helper = _interopRequireWildcard(_helper);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _printer = require('./printer.js');

var printer = _interopRequireWildcard(_printer);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
        extraInHelpMenu = _ref.extraInHelpMenu;

    _classCallCheck(this, Commander);

    this.command = null;
    this.usage = null;
    this.args = [];
    this.options = {};
    this.pkgInfo = {
      name: null,
      version: null,
      commandName: null
    };
    this.description = null;
    this.handlers = {};
    this.globalOptions = {};

    /* requires parsing */
    this.pkgInfo = helper.parsePkg(pkg);

    var _helper$parseArgv = helper.parseArgv(argv),
        command = _helper$parseArgv.command,
        args = _helper$parseArgv.args,
        options = _helper$parseArgv.options;

    this.command = command;
    this.args = args;
    this.options = options;

    /* from constructor */
    this.usage = usage;
    this.description = description;
    this.globalOptions = globalOptions || {};
    this.globalOptions['help'] = {
      names: ['--help', '-h'],
      help: 'show help for commands'
    };

    this._setUpHelpCommand(extraInHelpMenu);
  }

  _createClass(Commander, [{
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

      Object.keys(required).forEach(function (key) {
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
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var handler;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                handler = this.handlers[this.command];

                if (!(!handler || ['help'].indexOf(this.command) !== -1)) {
                  _context.next = 4;
                  break;
                }

                return _context.abrupt('return', handler ? handler.command() : this.handlers['help'].command());

              case 4:
                if (!(this.options['help'] || this.options['h'])) {
                  _context.next = 6;
                  break;
                }

                return _context.abrupt('return', printer.detailedHelp({ handler: handler }));

              case 6:

                this._checkRequiredOptions(this.globalOptions, this.options);
                this._checkRequiredOptions(handler.options, this.options);

                _context.next = 10;
                return handler.command({
                  args: this.args,
                  options: this.options
                });

              case 10:
                _context.next = 15;
                break;

              case 12:
                _context.prev = 12;
                _context.t0 = _context['catch'](0);

                console.log(_chalk2.default.red(_context.t0.message));

              case 15:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 12]]);
      }));

      function start() {
        return _ref2.apply(this, arguments);
      }

      return start;
    }()
  }]);

  return Commander;
}(), (_applyDecoratedDescriptor(_class.prototype, 'add', [_dec], Object.getOwnPropertyDescriptor(_class.prototype, 'add'), _class.prototype)), _class));
exports.default = Commander;