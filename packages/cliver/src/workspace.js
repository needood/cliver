import { getConfig, setConfig } from './config'
import { table } from 'table'
function setWorkspace(name){
    const config = getConfig()
    const workspace = _getWorkspace(config)
    workspace.set(name, process.cwd())
    _setWorkspace(config, workspace)
    setConfig(config)
    console.log(_table(workspace));
}
function removeWorkspace(name){
    const config = getConfig()
    const workspace = _getWorkspace(config)
    workspace.delete(name)
    _setWorkspace(config,workspace)
    setConfig(config)
    console.log(_table(workspace));
}
function listWorkspace(){
    const config = getConfig()
    const workspace = _getWorkspace(config)
    console.log(_table(workspace));
}
function _table(workspace){
    const arr = Array.from(workspace.entries())
    if(arr.length){
        return table(arr);
    }
    return 'NONE'
}
function _getWorkspace(config){
    let workspace 
    if(config.has('workspace')){
        workspace = new Map(Object.entries(config.get('workspace')))
    }else{
        workspace = new Map
    }
    return workspace
}
export function getWorkspaceByKey(key){
    const config = getConfig()
    const workspace = _getWorkspace(config)
    return workspace.get(key)
}
function _setWorkspace(config, workspace) {
    config.set('workspace', Object.fromEntries(workspace))
}
const workspaceSet = ['workspace-alias [alias]', '设置当前路径为工作区', (yargs) => {
    yargs
        .positional('alias', {
            describe: '工作区别名',
        })
},(argv)=>{
    if(argv.alias){
        setWorkspace(argv.alias)
    }
}]
const workspaceLs = ['workspace-ls', '列出所有工作区', () => {
},()=>{
    listWorkspace()
}]
const workspaceRm = ['workspace-rm [alias]', '删除指定工作区', (yargs) => {
    yargs
        .positional('alias', {
            describe: '工作区别名',
        })
}, (argv) => {
    if(argv.alias){
        removeWorkspace(argv.alias)
    }
}]
export function bindWorkspace(cli){
    cli.option('workspace', {
        describe: '指定工作区',
    })
    cli.command(...workspaceSet).command(...workspaceLs).command(...workspaceRm)
}