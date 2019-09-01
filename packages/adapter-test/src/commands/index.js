export const commands = [
    {
        name:"test [foo]",
        desc:"测试用命令",
        handler(argv){
            console.log('cwd',process.cwd())
            console.log('dirname',__dirname)
            console.log("test", argv.foo, argv)
        }
    }
]
export const options = [{
    name:"opt",
    alias:"o",
    desc: 'opt选项',
    handler(argv){
        console.log("opt",argv.opt)
    }
}]
export function start() {
    console.log('start script')
}