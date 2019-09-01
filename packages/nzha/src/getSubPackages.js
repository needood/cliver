import Path from 'path'
import glob from 'glob'
import readPkgUp from 'read-pkg-up'
export function getSubPackages({ cwd }) {
    const subPackageMap = new Map
    const { package: _package } = readPkgUp.sync({ cwd })
    _package.workspaces.forEach(workspace => {
        const files = glob.sync(workspace, { cwd })
        files.forEach(path => {
            const p = readPkgUp.sync({ cwd: Path.join(cwd, path) })
            if (p.package.name !== _package.name) {
                subPackageMap.set(p.package.name, {
                    path: Path.dirname(p.path),
                    relativePath: path,
                    package: p.package
                })
            }else{
                throw "subproject name must diffent"
            }
        })
    })
    return subPackageMap
}