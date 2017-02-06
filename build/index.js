'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

var Commander = function () {
  function Commander() {
    (0, _classCallCheck3.default)(this, Commander);
    this.configs = {};
    this.flags = {};
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
      var key = keysCopy.shift();
      var keysFound = [];

      while (cursor) {
        var keyFound = false;

        for (var i = 0; i < (cursor.subcommands || []).length; i++) {
          if (cursor.subcommands[i].key === key) {
            cursor = cursor.subcommands[i];
            keyFound = true;
            keysFound.push(key);
            key = keysCopy.shift();
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
        args: keysCopy
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
      console.log('\n', 'Usage: ' + (this.configs.key + ' ') + (commandKeys.length === 0 ? '' : commandKeys.join(' ')) + ' ' + (commandDisplayLines ? '[command]' : '') + ' ' + (flagDisplayLines ? '[flags]' : ''), '\n', flagDisplayLines ? flagDisplayLines + '\n' : '', commandDisplayLines ? commandDisplayLines + '\n' : '');
    }
  }, {
    key: 'version',
    value: function version() {
      console.log('\n', this.configs.package.name + ' ' + this.configs.package.version, '\n');
    }
  }, {
    key: 'execute',
    value: function execute() {
      var _parseArgv2 = parseArgv(),
          flags = _parseArgv2.flags,
          commands = _parseArgv2.commands;

      // handle special case -h --help


      if (flags.h || flags.help) {
        this.help(commands);
      } else if (flags.v || flags.version) {
        this.version();
      } else {
        var _getCommandNode2 = this.getCommandNode(commands),
            commandNode = _getCommandNode2.node,
            args = _getCommandNode2.args;

        if (!commandNode || !commandNode.command) {
          if (commands.length === 0) {
            return this.help(commands);
          }
          throw new Error(commands.join(' ') + ' is not a valid command');
        }
        // TODO add arg checking here, for required flags and args
        commandNode.command({ args: args, flags: flags });
      }
    }
  }]);
  return Commander;
}();

exports.default = Commander;