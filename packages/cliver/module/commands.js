"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.array.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildLocalCommands = buildLocalCommands;

var _workspace = require("./workspace");

var _resolveFrom = _interopRequireDefault(require("resolve-from"));

function buildLocalCommands(cli, adapterName) {
  var commands = [];

  if (adapterName) {
    try {
      var adapterPackagePath = _resolveFrom.default.silent(process.cwd(), adapterName);

      var {
        commands: _commands
      } = require(adapterPackagePath);

      commands = _commands || commands;
    } catch (err) {
      throw new Error(`There was a problem loading the adapter's package`);
    }
  }

  (0, _workspace.bindWorkspace)(cli);
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