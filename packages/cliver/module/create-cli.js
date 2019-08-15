"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createCli = createCli;

var _commands = require("./commands");

var _yargs = _interopRequireDefault(require("yargs"));

var _readPkgUp = _interopRequireDefault(require("read-pkg-up"));

function adapter() {
  var adapterName;

  try {
    var {
      package: _package
    } = _readPkgUp.default.sync();

    adapterName = _package.adapter || adapterName;
  } catch (err) {
    /* ignore */
  }

  return adapterName;
}

function createCli(argv) {
  var cli = (0, _yargs.default)();
  (0, _commands.buildLocalCommands)(cli, adapter());
  cli.usage(`Usage: $0 <command> [options]`).alias(`h`, `help`).alias(`v`, `version`).wrap(cli.terminalWidth()).demandCommand(1, `Pass --help to see all available commands and options.`).strict().showHelpOnFail(true).recommendCommands().parse(argv.slice(2));
}