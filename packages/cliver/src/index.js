import { createCli } from './create-cli'
import pkg from '../package.json'
import updateNotifier from 'update-notifier'
import { argv } from 'yargs'
import { getWorkspaceByKey } from './workspace'
if(argv.workspace){
    const workspace = getWorkspaceByKey(argv.workspace)
    if(workspace){
        process.chdir(workspace)
    }
}
// Check if update is available
updateNotifier({ pkg }).notify()

export function runCli(){
    createCli(process.argv)
}
export function buildCli({ commands }) {
    if(commands){
        createCli(process.argv, { commands })
    }else{
        throw new Error("adapter is required")
    }
}