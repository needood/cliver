"use strict";

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.object.entries");

require("core-js/modules/es.object.from-entries");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getWorkspaceByKey = getWorkspaceByKey;
exports.bindWorkspace = bindWorkspace;
exports.workspaceRm = exports.workspaceLs = exports.workspaceSet = exports.workspace = void 0;

var _config = require("./config");

var desc = `workspace`;

function setWorkspace(name) {
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

function getWorkspaceByKey(key) {
  var config = (0, _config.getConfig)();

  var workspace = _getWorkspace(config);

  return workspace.get(key);
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
var workspaceSet = ['workspace set [name]', '设置当前路径为工作区', yargs => {
  yargs.positional('name', {
    describe: '工作区别名'
  });
}, argv => {
  if (argv.name) {
    setWorkspace(argv.name);
  }
}];
exports.workspaceSet = workspaceSet;
var workspaceLs = ['workspace ls', '列出所有工作区', () => {}, () => {
  listWorkspace();
}];
exports.workspaceLs = workspaceLs;
var workspaceRm = ['workspace rm [name]', '删除指定工作区', yargs => {
  yargs.positional('name', {
    describe: '工作区别名'
  });
}, argv => {
  if (argv.name) {
    removeWorkspace(argv.name);
  }
}];
exports.workspaceRm = workspaceRm;

function bindWorkspace(cli) {
  cli.option('workspace', {
    describe: '指定工作区'
  });
  cli.command.apply(cli, workspaceRm);
  cli.command.apply(cli, workspaceSet);
  cli.command.apply(cli, workspaceLs);
}