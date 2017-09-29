'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function strWithPadding(str, paddingSize) {
  var padding = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 2;

  return str + ' '.repeat(paddingSize - str.length + padding);
}

exports.default = {
  subheader: {
    calculateLeftPadding: function calculateLeftPadding() {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref$subcommands = _ref.subcommands,
          subcommands = _ref$subcommands === undefined ? {} : _ref$subcommands,
          _ref$commands = _ref.commands,
          commands = _ref$commands === undefined ? [] : _ref$commands,
          _ref$flags = _ref.flags,
          flags = _ref$flags === undefined ? [] : _ref$flags;

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
      var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref2$spacing = _ref2.spacing,
          spacing = _ref2$spacing === undefined ? 2 : _ref2$spacing,
          paddingSize = _ref2.paddingSize;

      var commandsHelpText = (0, _keys2.default)(_subcommands).map(function (key) {
        var description = _subcommands[key].shortDescription || '';
        return '' + ' '.repeat(spacing) + strWithPadding(key, paddingSize, 4) + description;
      }).join('\n');

      return commandsHelpText;
    },
    commands: function commands(_commands) {
      var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref3$spacing = _ref3.spacing,
          spacing = _ref3$spacing === undefined ? 2 : _ref3$spacing,
          paddingSize = _ref3.paddingSize;

      var argumentsHelpText = _commands.map(function (f) {
        var description = f.shortDescription || '';
        return '' + ' '.repeat(spacing) + strWithPadding(f.key, paddingSize, 4) + description;
      }).join('\n');

      return argumentsHelpText;
    },
    flags: function flags(_flags) {
      var _ref4 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref4$spacing = _ref4.spacing,
          spacing = _ref4$spacing === undefined ? 2 : _ref4$spacing,
          paddingSize = _ref4.paddingSize;

      var flagsText = _flags.map(function (f) {
        var keys = f.keys.map(function (key) {
          return key.length === 1 ? '-' + key : '--' + key;
        }).join(', ');
        var description = f.shortDescription || '';
        return '' + ' '.repeat(spacing) + strWithPadding('' + keys + (f.required ? '*' : ''), paddingSize, 4) + description;
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