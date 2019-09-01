import { createCli } from './create-cli'
import pkg from '../package.json'
import yargs from 'yargs'
import updateNotifier from 'update-notifier'
import { bindWorkspaceOption, getWorkspaceByKey } from './workspace';
// Check if update is available
updateNotifier({ pkg }).notify()
bindWorkspaceOption(yargs()).parse(process.argv.slice(2), function (err, argv, output) {
    if (argv.workspace) {
        const workspace = getWorkspaceByKey(argv.workspace)
        if (workspace) {
            process.chdir(workspace)
        }
    }
})

export function runCli(){
    createCli(process.argv)
}
export function buildCli({ commands, options }) {
    if (commands) {
        createCli(process.argv, { commands, options })
    } else {
        throw new Error("adapter is required")
    }
}