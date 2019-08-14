import resolveCwd from 'resolve-cwd'

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
    commands.forEach(command => {
        genCommand(command)
    })
    function genCommand({ name, desc, handler }) {
        desc = desc || `command:${name}`
        return cli.command(name, desc, () => { }, (...argv) => {
            return handler(...argv)
        })
    }
}