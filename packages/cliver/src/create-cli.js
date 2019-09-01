import { bindCommands, bindCommandsByadapterName } from './commands'
import { bindWorkspace, bindWorkspaceOption } from './workspace'
import { bindAdapter } from './adapter'
import yargs from 'yargs'
import readPkgUp from 'read-pkg-up'
import { bindOptionsByadapterName, bindOptions } from './options';
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

export function createCli(pargv, { commands, options } = {}) {
    let cli = yargs()
    bindAdapter(cli)
    bindWorkspaceOption(cli)
    bindWorkspace(cli)
    if(options){
        bindOptions(cli, options)
    }
    if(commands){
        bindCommands(cli, commands)
    }
    bindOptionsByadapterName(cli, getAdapterName())
    bindCommandsByadapterName(cli, getAdapterName())
    cli.usage(`Usage: $0 <command> [options]`)
        .alias(`help`, `h`)
        .alias(`version`, `v`)
        .wrap(cli.terminalWidth())
        .demandCommand(1, `Pass --help to see all available commands and options.`)
        //.strict()
        .showHelpOnFail(true)
        .recommendCommands()
        .parse(pargv.slice(2))
}