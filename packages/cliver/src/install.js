import execa from 'execa'
//TODO:清理npm
//TODO:添加shared

const spawn = (cmd) => {
    const [file, ...args] = cmd.split(/\s+/)
    return execa.sync(file, args, { stdio: `inherit` })
}

// Checks the existence of yarn package
// We use yarnpkg instead of yarn to avoid conflict with Hadoop yarn
// Refer to https://github.com/yarnpkg/yarn/issues/673
//
// Returns true if yarn exists, false otherwise
const shouldUseYarn = () => {
    try {
        execa.sync(`yarnpkg --version`, { stdio: `ignore` })
        return true
    } catch (e) {
        return false
    }
}
export async function install(rootPath,option) {
    const prevDir = process.cwd()
    console.info(`Installing packages...`)
    if(rootPath){
        process.chdir(rootPath)
    }
    try {
        let cmd = shouldUseYarn() ? spawn(`yarnpkg add ${option}`) : spawn(`npm install ${option}`)
        await cmd
    } finally {
        if(rootPath){
            process.chdir(prevDir)
        }
    }
}