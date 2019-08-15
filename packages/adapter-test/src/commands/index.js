export const commands = [
    {
        name:"test",
        desc:"测试用命令",
        handler(...args){
            console.log('cwd',process.cwd())
            console.log('dirname',__dirname)
            console.log("test",...args)
        }
    }
]