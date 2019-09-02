import resolveFrom from 'resolve-from'
import yargs from 'yargs'
export function bindOptions(cli, options,argv=process.argv.slice(2)) {
    const _cli = yargs()
    options.forEach(option => {
        genOption(cli, option)
        genOption(_cli, option)
    })
    _cli.parse(argv, function (err, argv, output) {
        options.forEach(option => {
            optionHandle(argv,option)
        })
    })
}
function optionHandle(argv, { handler }) {
    if(handler){
        handler(argv)
    }
}
function genOption(cli, { name, desc, alias }) {
    return cli.option(name, {
        describe: desc,
        alias,
    })
}
export function bindOptionsByadapterName(cli, adapterName) {
    if(adapterName){
        try {
            const adapterPackagePath = resolveFrom.silent(process.cwd(),adapterName)
            const { options } = require(adapterPackagePath)
            bindOptions(cli, options)
        } catch (err) {
            //TODO:adapter依赖未安装时卡在抛错的流程问题
            //throw (new Error(`There was a problem loading the local adapter`))
        }
    }
}