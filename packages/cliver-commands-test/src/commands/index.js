export const commands = [
    {
        name:"test",
        desc:"desc",
        handler(...args){
            console.log('cwd',process.cwd())
            console.log('dirname',__dirname)
            console.log("test",...args)
        }
    }
]