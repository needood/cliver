import fs from 'fs-extra'
import readPkgUp from 'read-pkg-up'
import path from 'path'
import execa from 'execa'
import pathKey from 'path-key'



import { getSubPackages } from '../getSubPackages';
const nzhaPath = path.join(__dirname,'..','..')

export const commands = [{
    name: "new [name]",
    desc: "新建子项目",
    async handler(argv) {
        if (argv.name) {
            const cwd = process.cwd()
            const { path: __path } = getMonorepoPackage({ cwd })
            const projectPath = path.dirname(__path)
            const _path = path.join(projectPath, 'packages', argv.name)
            fs.ensureFileSync(path.join(_path, 'src', 'index.js'))
            process.chdir(_path)
            try {
                await init(undefined, '-y')
                const { package: _package, path: pPath } = readPkgUp.sync({ cwd: process.cwd() })
                _package.scripts.prepublish = "npm run babel-lib"
                _package.scripts['babel-lib'] = "cross-env BABEL_ENV=lib babel --extensions '.ts,.js' --root-mode upward --source-maps=true src --out-dir lib"
                _package.scripts.watch = "npm run watch:babel-lib"
                _package.scripts['watch:babel-lib'] = "cross-env BABEL_ENV=lib babel --extensions '.ts,.js' --root-mode upward --source-maps=true src --watch --out-dir lib"
                _package.main = 'lib/index.js'
                _package.dependencies = {
                    "core-js": "3",
                    "@babel/runtime": "^7.5.5"
                }
                fs.writeFileSync(pPath, JSON.stringify(_package, null, 2));
            } finally {
                process.chdir(cwd)
            }
        }
    }
}, {
    name: "init",
    desc: "初始化项目",
    async handler(argv) {
        await init(undefined, '-y')
        const cwd = process.cwd()
        const { package: _package, path: projectPackagePath } = readPkgUp.sync({ cwd })
        _package.workspaces = ["packages/*"]
        _package.private = true
        _package.devDependencies = {
            "@babel/cli": "^7.5.5",
            "@babel/core": "^7.5.5",
            "@babel/plugin-proposal-decorators": "^7.5.5",
            "@babel/plugin-proposal-class-properties": "^7.5.5",
            "@babel/plugin-transform-runtime": "^7.3.4",
            "@babel/preset-env": "^7.3.4",
            "@babel/preset-typescript": "^7.6.0",
            "babel-plugin-module-resolver": "^3.2.0",
            "cross-env": "^5.2.0",
            "glob": "^7.1.4",
            "read-pkg-up": "^6.0.0",
        },
        fs.writeFileSync(projectPackagePath, JSON.stringify(_package, null, 2));
        const {  path: pPath } = readPkgUp.sync({ cwd:__dirname })
        fs.copySync(path.join(path.dirname(pPath), 'templates'), path.dirname(projectPackagePath), {})
    }
}, {
    name: "watch",
    desc: "监视所有子项目的src文件,实时转换代码",
    handler(argv) {
        //TODO:使用babel来watch所有子项目
    }
}, {
    name: "run [script]",
    desc: "运行所有子项目的脚本",
    handler(argv) {
        if(argv.script){
            const cwd = process.cwd()
            const { path: __path } = getMonorepoPackage({ cwd })
            const projectPath = path.dirname(__path)
            const _PATH = []
            _PATH.push(path.join(nzhaPath, 'node_modules', '.bin'));
            _PATH.push(path.dirname(process.execPath));
            const prevDir = process.cwd()
            process.chdir(projectPath)
            try {
                spawn(`wsrun --exclude-missing ${argv.script}`, { env: { PATH: _PATH.concat(getEnvPath()).join(path.delimiter) } })
            } finally {
                process.chdir(prevDir)
            }
        }
    }
}, {
    name: "bootstrap",
    desc: "安装依赖",
    async handler(argv) {
        const cwd = process.cwd()
        const { package: _package, path: projectPackagePath } = getMonorepoPackage({ cwd })
        const backupPackage = projectPackagePath.replace(/(package\.json)$/, '$1.nzha-backup')
        const projectPath = path.dirname(projectPackagePath)
        fs.copyFileSync(projectPackagePath, backupPackage)
        try {
            const packagesMap = getSubPackages({ cwd: projectPath })
            const subPackageLinks= []
            const projectModulePath = path.join(projectPath, 'node_modules')
            Array.from(packagesMap.entries()).forEach(([_, _p]) => {
                if(_p.package.dependencies){
                    _package.dependencies = Object.assign({}, _package.dependencies, _p.package.dependencies)
                }
                if(_p.package.devDependencies){
                    _package.devDependencies = Object.assign({}, _package.devDependencies, _p.package.devDependencies)
                }
                if(_p.package.peerDependencies){
                    _package.peerDependencies = Object.assign({}, _package.peerDependencies, _p.package.peerDependencies)
                }
                const pathArr = _p.package.name.split('/')
                subPackageLinks.push({ dest: path.join(projectModulePath, ...pathArr), src: _p.relativePath })
            });
            fs.writeFileSync(projectPackagePath, JSON.stringify(_package, null, 2));
            await install()
            subPackageLinks.forEach(({ src, dest }) => {
                fs.ensureSymlinkSync(src, dest)
            })
            //TODO:运行script
        } finally {
            fs.copyFileSync(backupPackage, projectPackagePath)
            fs.removeSync(backupPackage)
        }
    }
}]
async function init(rootPath, option) {
    const prevDir = process.cwd()
    if (rootPath) {
        process.chdir(rootPath)
    }
    try {
        let cmd = shouldUseYarn() ? spawn(`yarnpkg init ${option}`) : spawn(`npm init ${option}`)
        await cmd
    } finally {
        if (rootPath) {
            process.chdir(prevDir)
        }
    }
}
function spawn(cmd,opt){
    const [file, ...args] = cmd.split(/\s+/)
    return execa.sync(file, args, Object.assign({}, { stdio: `inherit` }, opt))
}

// Checks the existence of yarn package
// We use yarnpkg instead of yarn to avoid conflict with Hadoop yarn
// Refer to https://github.com/yarnpkg/yarn/issues/673
//
// Returns true if yarn exists, false otherwise
function shouldUseYarn() {
    try {
        execa.sync(`yarnpkg --version`, { stdio: `ignore` })
        return true
    } catch (e) {
        return false
    }
}
async function install(rootPath) {
    const prevDir = process.cwd()
    console.info(`Installing packages...`)
    if(rootPath){
        process.chdir(rootPath)
    }
    try {
        let cmd = shouldUseYarn() ? spawn(`yarnpkg`) : spawn(`npm install`)
        await cmd
    } finally {
        if(rootPath){
            process.chdir(prevDir)
        }
    }
}
function getEnvPath(){
    const {env} = process
    const path = pathKey({env});
    return env[path]
}
function getMonorepoPackage(opt){
    const cwd = opt.cwd || process.cwd()
    const { package: _package, path: _path } = readPkgUp.sync(opt)
    if(_package.workspaces){
        return { package: _package, path: _path }
    }else{
        return getMonorepoPackage(Object.assign({}, opt, { cwd: path.join(cwd, '..') }))
    }
}