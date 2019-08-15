import os from 'os'
import path from 'path'
import fs from 'fs-extra'
const homedir = os.homedir();
const configName = '.cliverrc'
const configPath = path.join(homedir, configName)

export function setConfig(map) {
    fs.ensureFileSync(configPath)
    const object = Object.fromEntries(map);
    fs.writeFileSync(configPath, JSON.stringify(object), 'utf-8')
    return true
}
export function getConfig() {
    if (fs.existsSync(configPath)) {
        const context = fs.readFileSync(configPath, 'utf-8')
        const json = JSON.parse(context)
        return new Map(Object.entries(json))
    }
    return new Map
}
