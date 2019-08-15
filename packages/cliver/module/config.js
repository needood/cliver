"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.object.entries");

require("core-js/modules/es.object.from-entries");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setConfig = setConfig;
exports.getConfig = getConfig;

var _os = _interopRequireDefault(require("os"));

var _path = _interopRequireDefault(require("path"));

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var homedir = _os.default.homedir();

var configName = '.cliverrc';

var configPath = _path.default.join(homedir, configName);

function setConfig(map) {
  _fsExtra.default.ensureFileSync(configPath);

  var object = Object.fromEntries(map);

  _fsExtra.default.writeFileSync(configPath, JSON.stringify(object), 'utf-8');

  return true;
}

function getConfig() {
  if (_fsExtra.default.existsSync(configPath)) {
    var context = _fsExtra.default.readFileSync(configPath, 'utf-8');

    var json = JSON.parse(context);
    return new Map(Object.entries(json));
  }

  return new Map();
}