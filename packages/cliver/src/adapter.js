import readPkgUp from 'read-pkg-up'
import { install } from './install'
import fs from 'fs-extra'
export function bindAdapter(cli){
    cli.command(...adapter)
}
const adapter = ['adapter [module]','添加适配器',(yargs) => {
    yargs
        .positional('module', {
            describe: '模块名',
        })
},(argv)=>{
    if(argv.module){
        setAdapter(argv.module)
    }else{
        //TODO:在依赖包中选择模块
    }
}]
function setAdapter(_module) {
    const { package: _package, path } = readPkgUp.sync({ cwd: process.cwd() })
    _package.adapter = _module
    fs.writeFileSync(path, JSON.stringify(_package, null, 2));
    if (_module[0] !== '.') {
        //TODO:判断是否已经安装依赖
        const { dependencies = {}, devDependencies = {} } = _package
        if (!dependencies.hasOwnProperty(_module) && !devDependencies.hasOwnProperty(_module)) {
            install([_module])
        }
    }
}