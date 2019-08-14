#!/usr/bin/env node
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _createCli = require("./create-cli");

var _package = _interopRequireDefault(require("../package.json"));

var _updateNotifier = _interopRequireDefault(require("update-notifier"));

// Check if update is available
(0, _updateNotifier.default)({
  pkg: _package.default
}).notify();
(0, _createCli.createCli)(process.argv);