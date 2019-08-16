import { bindCommands, bindCommandsByadapterName } from './commands'
import { bindWorkspace } from './workspace'
import { bindAdapter } from './adapter'
import yargs from 'yargs'
import readPkgUp from 'read-pkg-up'
function getAdapterName() {
    let adapterName
    try {
        const { package: _package } = readPkgUp.sync({ cwd: process.cwd() })
        adapterName = _package.adapter || adapterName
    } catch (err) {
        /* ignore */
    }
    return adapterName
}

export function createCli(argv, { commands }={}) {
    let cli = yargs()
    bindAdapter(cli)
    bindWorkspace(cli)
    if(commands){
        bindCommands(cli, commands)
    }
    bindCommandsByadapterName(cli, getAdapterName())
    cli.usage(`Usage: $0 <command> [options]`)
        .alias(`h`, `help`)
        .alias(`v`, `version`)
        .wrap(cli.terminalWidth())
        .demandCommand(1, `Pass --help to see all available commands and options.`)
        .strict()
        .showHelpOnFail(true)
        .recommendCommands()
        .parse(argv.slice(2))
}