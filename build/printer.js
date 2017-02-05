'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

exports.help = help;
exports.detailedHelp = detailedHelp;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pad = '  ';

function formatHelpStr(options) {
  return (0, _keys2.default)(options).map(function (key) {
    var option = options[key];

    var names = option.name || option.names && option.names.join(', ');
    if (!names) {
      return;
    }

    var spacing = '\t\t';
    if (names.length > 12) {
      spacing = '\t';
    }
    if (names.length < 4) {
      spacing = '\t\t\t';
    }
    return '' + pad + names + spacing + (option.help || '') + (option.required && ' (*required)' || '');
  });
}

function help(_ref) {
  var pkgInfo = _ref.pkgInfo,
      handlers = _ref.handlers,
      globalOptions = _ref.globalOptions,
      usage = _ref.usage,
      description = _ref.description,
      extraInHelpMenu = _ref.extraInHelpMenu;

  var handlersLines = handlers && (0, _keys2.default)(handlers).length && ['Commands:\n'].concat(formatHelpStr(handlers)).concat(['']);

  var globalOptionsLines = globalOptions && (0, _keys2.default)(globalOptions).length && ['Global Options:\n'].concat(formatHelpStr(globalOptions)).concat(['']);

  var lines = ['', pkgInfo ? pkgInfo.name + ' ' + pkgInfo.version + '\n' : null, description ? '' + pad + description + '\n' : null, usage ? 'Usage: ' + usage + '\n' : null].concat(handlersLines).concat(globalOptionsLines).filter(function (a) {
    return a !== null && a !== undefined;
  });

  lines.forEach(function (line) {
    console.log('' + pad + line);
  });
  if (extraInHelpMenu) {
    console.log(extraInHelpMenu);
  }
}

function detailedHelp(_ref2) {
  var handler = _ref2.handler;

  var optionsLines = handler.options && (0, _keys2.default)(handler.options).length && ['Options:\n'].concat(formatHelpStr(handler.options)).concat(['']);

  var lines = ['', handler.usage ? 'Usage: ' + handler.usage + '\n' : null].concat(optionsLines).filter(function (a) {
    return a !== null && a !== undefined;
  });

  lines.forEach(function (line) {
    console.log('' + pad + line);
  });
}