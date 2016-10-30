'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.help = help;
exports.detailedHelp = detailedHelp;
var pad = '  ';

function getOptionsLines(options) {
  return Object.keys(options).map(function (key) {
    var option = options[key];

    var names = option.name || option.names.join(', ');
    var spacing = '\t\t';
    if (names.length > 10) {
      spacing = '\t';
    }
    if (names.length < 5) {
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

  var handlersLines = handlers && Object.keys(handlers).length && ['Commands:\n'].concat(Object.keys(handlers).map(function (key) {
    var handler = handlers[key];
    return pad + '- ' + handler.name + '\t\t' + (handler.help || '');
  })).concat(['']);

  // TODO(sam) this and handlersLines are the same thing, refactor later
  var globalOptionsLines = globalOptions && Object.keys(globalOptions).length && ['Global Options:\n'].concat(getOptionsLines(globalOptions)).concat(['']);

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

  var optionsLines = handler.options && Object.keys(handler.options).length && ['Options:\n'].concat(getOptionsLines(handler.options)).concat(['']);

  var lines = ['', handler.usage ? 'Usage: ' + handler.usage + '\n' : null].concat(optionsLines).filter(function (a) {
    return a !== null && a !== undefined;
  });

  lines.forEach(function (line) {
    console.log('' + pad + line);
  });
}