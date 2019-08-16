import resolveFrom from 'resolve-from'

export function bindCommandsByadapterName(cli, adapterName) {
    if(adapterName){
        try {
            const adapterPackagePath = resolveFrom.silent(process.cwd(),adapterName)
            const { commands } = require(adapterPackagePath)
            bindCommands(cli, commands)
        } catch (err) {
            //TODO:adapter依赖未安装时卡在抛错的流程问题
            //throw (new Error(`There was a problem loading the local adapter`))
        }
    }
}
export function bindCommands(cli, commands) {
    commands.forEach(command => {
        genCommand(cli, command)
    })
}
function genCommand(cli, { name, desc, handler }) {
    desc = desc || `(Empty)`
    desc = '* ' + desc
    return cli.command(name, desc, () => { }, (...argv) => {
        return handler(...argv)
    })
}