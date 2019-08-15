#!/usr/bin/env node
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _createCli = require("./create-cli");

var _package = _interopRequireDefault(require("../package.json"));

var _updateNotifier = _interopRequireDefault(require("update-notifier"));

var _yargs = require("yargs");

var _workspace = require("./workspace");

if (_yargs.argv.workspace) {
  var workspace = (0, _workspace.getWorkspaceByKey)(_yargs.argv.workspace);

  if (workspace) {
    process.chdir(workspace);
  }
} // Check if update is available


(0, _updateNotifier.default)({
  pkg: _package.default
}).notify();
(0, _createCli.createCli)(process.argv);