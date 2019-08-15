import { getConfig, setConfig } from './config'
const desc = `workspace`
function setWorkspace(name){
    if(!name){
        return
    }
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