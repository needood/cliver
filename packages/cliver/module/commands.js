"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildLocalCommands = buildLocalCommands;

var _resolveCwd = _interopRequireDefault(require("resolve-cwd"));

function buildLocalCommands(cli, adapterName) {
  let commands = [];

  if (adapterName) {
    try {
      const adapterPackagePath = _resolveCwd.default.silent(`${adapterName}`);

      let {
        commands: _commands
      } = require(adapterPackagePath);

      commands = _commands || commands;
    } catch (err) {
      throw new Error(`There was a problem loading the adapter's package`);
    }
  }

  commands.forEach(command => {
    genCommand(command);
  });

  function genCommand({
    name,
    desc,
    handler
  }) {
    desc = desc || `command:${name}`;
    return cli.command(name, desc, () => {}, (...argv) => {
      return handler(...argv);
    });
  }
}