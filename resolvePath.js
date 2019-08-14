const glob = require("glob")
const fs = require("fs")
const Path = require("path")
const readPkgUp = require('read-pkg-up');


const subPackage = []
const { package } = readPkgUp.sync({ cwd: __dirname })
package.workspaces.forEach(workspace => {
    const files = glob.sync(workspace, {cwd:__dirname})
    files.forEach(path => {
        const p = readPkgUp.sync({ cwd: Path.join(__dirname, path) })
        if (p.package.name !== package.name) {
            subPackage.push(p)
        }
    })
})
const subPackageMap = new Map
subPackage.forEach(p => {
    subPackageMap.set(p.package.name, {
        path: p.path.replace(/package\.json$/, ''),
        package: p.package
    })
})

function clientExt(ext,filePath,targetPath){
    const testExp = new RegExp(`^(.*)\.${ext}(\.js)?$`)
    if (testExp.test(filePath)) {
        return [false, targetPath]
    }
    if (fs.existsSync(filePath.replace(/^(.*?)(\.js)?$/, `$1.${ext}.js`))) {
        return [true,targetPath.replace(/^(.*?)(\.js)?$/, `$1.${ext}`)]
    }
    if (fs.existsSync(filePath.replace(/^(.*?)$/, `$1/index.${ext}.js`))) {
        return [true,targetPath.replace(/^(.*?)$/, `$1/index.${ext}`)]
    }
    return [false, targetPath]
}
function resolvePath(type, extension) {
    return function (sourcePath, currentFile, opts) {
        if (sourcePath[0] === '.') {
            return sourcePath;
        }
        const sourceName = /^(@.*?\/)?.*?(?=\/|$)/.exec(sourcePath)[0]
        if (subPackageMap.has(sourceName)) {
            const targetPath = sourcePath.replace(`${sourceName}/src/`, `${sourceName}/${type}/`)
            if (extension) {
                const { path } = subPackageMap.get(sourceName)
                const filePath = Path.join(path, sourcePath.replace(sourceName, ''))
                const result = clientExt(extension, filePath, targetPath)
                if (result[0] === true) {
                    return result[1]
                }
            }
            return targetPath
        }
        return sourcePath;
    }
}
module.exports = resolvePath