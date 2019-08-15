import { getConfig, setConfig } from './config'
const desc = `workspace`
function setWorkspace(name){
    const config = getConfig()
    const workspace = _getWorkspace(config)
    workspace.set(name, process.cwd())
    _setWorkspace(config,workspace)
    setConfig(config)
    console.log(workspace)
}
function removeWorkspace(name){
    if(!name){
        return
    }
    const config = getConfig()
    const workspace = _getWorkspace(config)
    workspace.delete(name)
    _setWorkspace(config,workspace)
    setConfig(config)
    console.log(workspace)
}
function listWorkspace(){
    const config = getConfig()
    const workspace = _getWorkspace(config)
    console.log(workspace)
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
function handler({ _, $0 }) {
    const command = _[1]
    const name = _[2]
    switch(command){
        case 'set':
            setWorkspace(name)
            break
        case 'rm':
            removeWorkspace(name)
            break
        case 'ls':
            listWorkspace()
        default:
    }
}
export const workspace = ['workspace', desc, () => { }, handler]
export const workspaceSet = ['workspace set [name]', '设置当前路径为工作区', (yargs) => {
    yargs
        .positional('name', {
            describe: '工作区别名',
        })
},(argv)=>{
    if(argv.name){
        setWorkspace(argv.name)
    }
}]
export const workspaceLs = ['workspace ls', '列出所有工作区', () => {
},()=>{
    listWorkspace()
}]
export const workspaceRm = ['workspace rm [name]', '删除指定工作区', (yargs) => {
    yargs
        .positional('name', {
            describe: '工作区别名',
        })
}, (argv) => {
    if(argv.name){
        removeWorkspace(argv.name)
    }
}]
export function bindWorkspace(cli){
    cli.option('workspace', {
        describe: '指定工作区',
    })
    cli.command.apply(cli, workspaceRm)
    cli.command.apply(cli, workspaceSet)
    cli.command.apply(cli, workspaceLs)
}