import resolveCwd from 'resolve-cwd'
import {workspace} from './workspace'

export function buildLocalCommands(cli, adapterName) {
    let commands = []
    if(adapterName){
        try {
            const adapterPackagePath = resolveCwd.silent(`${adapterName}`)
            let { commands: _commands } = require(adapterPackagePath)
            commands = _commands || commands
        } catch (err) {
            throw (new Error(`There was a problem loading the adapter's package`))
        }
    }
    cli.command.apply(cli, workspace)
    commands.forEach(command => {
        genCommand(command)
    })
    function genCommand({ name, desc, handler }) {
        desc = desc || `(Empty)`
        desc = '*' + desc
        return cli.command(name, desc, () => { }, (...argv) => {
            return handler(...argv)
        })
    }
}