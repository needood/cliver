"use strict";

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.object.entries");

require("core-js/modules/es.object.from-entries");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.workspace = void 0;

var _config = require("./config");

var desc = `workspace`;

function setWorkspace(name) {
  if (!name) {
    return;
  }

  var config = (0, _config.getConfig)();

  var workspace = _getWorkspace(config);

  workspace.set(name, process.cwd());

  _setWorkspace(config, workspace);

  (0, _config.setConfig)(config);
  console.log(workspace);
}

function removeWorkspace(name) {
  if (!name) {
    return;
  }

  var config = (0, _config.getConfig)();

  var workspace = _getWorkspace(config);

  workspace.delete(name);

  _setWorkspace(config, workspace);

  (0, _config.setConfig)(config);
  console.log(workspace);
}

function listWorkspace() {
  var config = (0, _config.getConfig)();

  var workspace = _getWorkspace(config);

  console.log(workspace);
}

function _getWorkspace(config) {
  var workspace;

  if (config.has('workspace')) {
    workspace = new Map(Object.entries(config.get('workspace')));
  } else {
    workspace = new Map();
  }

  return workspace;
}

function _setWorkspace(config, workspace) {
  config.set('workspace', Object.fromEntries(workspace));
}

function handler({
  _,
  $0
}) {
  var command = _[1];
  var name = _[2];

  switch (command) {
    case 'set':
      setWorkspace(name);
      break;

    case 'rm':
      removeWorkspace(name);
      break;

    case 'ls':
      listWorkspace();

    default:
  }
}

var workspace = ['workspace', desc, () => {}, handler];
exports.workspace = workspace;