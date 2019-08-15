const npm = require('npm')

module.exports = {
    install
}
let installing = false

function install(deps, path) {
    return new Promise((resolve, reject) => {
        npm.load(function (error) {
            if (installing) {
                console.error("installing...")
                return reject()
            }
            installing = true
            if(path){
                npm.prefix = path
            }
            //npm.config.set('save-dev',true)
            //npm.config.set('registry', 'https://registry.npm.taobao.org')
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