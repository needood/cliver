"use strict";

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.object.entries");

require("core-js/modules/es.object.from-entries");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getWorkspaceByKey = getWorkspaceByKey;
exports.bindWorkspace = bindWorkspace;
exports.workspaceRm = exports.workspaceLs = exports.workspaceSet = void 0;

var _config = require("./config");

var _table2 = require("table");

function setWorkspace(name) {
  var config = (0, _config.getConfig)();

  var workspace = _getWorkspace(config);

  workspace.set(name, process.cwd());

  _setWorkspace(config, workspace);

  (0, _config.setConfig)(config);
  console.log(_table(workspace));
}

function removeWorkspace(name) {
  var config = (0, _config.getConfig)();

  var workspace = _getWorkspace(config);

  workspace.delete(name);

  _setWorkspace(config, workspace);

  (0, _config.setConfig)(config);
  console.log(_table(workspace));
}

function listWorkspace() {
  var config = (0, _config.getConfig)();

  var workspace = _getWorkspace(config);

  console.log(_table(workspace));
}

function _table(workspace) {
  var arr = Array.from(workspace.entries());

  if (arr.length) {
    return (0, _table2.table)(arr);
  }

  return 'NONE';
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

var workspaceSet = ['workspace-alias [alias]', '设置当前路径为工作区', yargs => {
  yargs.positional('alias', {
    describe: '工作区别名'
  });
}, argv => {
  if (argv.alias) {
    setWorkspace(argv.alias);
  }
}];
exports.workspaceSet = workspaceSet;
var workspaceLs = ['workspace-ls', '列出所有工作区', () => {}, () => {
  listWorkspace();
}];
exports.workspaceLs = workspaceLs;
var workspaceRm = ['workspace-rm [alias]', '删除指定工作区', yargs => {
  yargs.positional('alias', {
    describe: '工作区别名'
  });
}, argv => {
  if (argv.alias) {
    removeWorkspace(argv.alias);
  }
}];
exports.workspaceRm = workspaceRm;

function bindWorkspace(cli) {
  cli.option('workspace', {
    describe: '指定工作区'
  });
  cli.command(...workspaceSet).command(...workspaceLs).command(...workspaceRm);
}