"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.array.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildLocalCommands = buildLocalCommands;

var _resolveCwd = _interopRequireDefault(require("resolve-cwd"));

var _workspace = require("./workspace");

function buildLocalCommands(cli, adapterName) {
  var commands = [];

  if (adapterName) {
    try {
      var adapterPackagePath = _resolveCwd.default.silent(`${adapterName}`);

      var {
        commands: _commands
      } = require(adapterPackagePath);

      commands = _commands || commands;
    } catch (err) {
      throw new Error(`There was a problem loading the adapter's package`);
    }
  }

  cli.command.apply(cli, _workspace.workspace);
  commands.forEach(command => {
    genCommand(command);
  });

  function genCommand({
    name,
    desc,
    handler
  }) {
    desc = desc || `(Empty)`;
    desc = '*' + desc;
    return cli.command(name, desc, () => {}, (...argv) => {
      return handler(...argv);
    });
  }
}