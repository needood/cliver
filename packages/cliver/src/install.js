const npm = require('npm')

let installing = false

export async function install(deps, configEntries=[]) {
    return await new Promise((resolve, reject) => {
        npm.load(function (error) {
            if (installing) {
                console.error("installing...")
                return reject()
            }
            installing = true
            configEntries.forEach(item => {
                if(item[0]==='prefix'){
                    npm.prefix = item[1]
                }else{
                    npm.config.set(item[0],item[1])
                }
            });
            npm.commands.install(deps, function (error, data) {
                installing = false
                if (error) {
                    return reject(error)
                }
                resolve()
            })
        })
    })
}