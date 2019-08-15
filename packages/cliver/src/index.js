#!/usr/bin/env node
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

createCli(process.argv)
