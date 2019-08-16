# cliver

cliver是一个通用的cli工具并且集成一些附加的功能

cliver会向着两个方向发展:

1. 更快捷地开发一个项目的cli
2. 更方便地管理你在使用的项目

## 安装

```
npm install -g cliver
```

## 使用说明

```
Usage: cliver <command> [options]

命令：
  cliver adapter [module]         添加适配器
  cliver workspace-alias [alias]  设置当前路径为工作区
  cliver workspace-ls             列出所有工作区
  cliver workspace-rm [alias]     删除指定工作区

选项：
  --workspace    指定工作区
  -h, --help     显示帮助信息                                                   [布尔]
  -v, --version  显示版本号                                                     [布尔]
```


## 工作区

提供工作区特性绑定你的当前路径到工作区

提供 workspace-ls workspace-alias workspace-rm 三个命令管理工作区

添加 --workspace='alias'选项,你可以在任意目录下运行工作区目录下的命令

## 适配器

添加适配器定制cliver的命令,参考 packages/adapter-test

方法1: 在项目中的package.json 文件中添加adapter到对应的依赖包或者js文件

方法2:
通过 cliver adapter [module] 命令为项目添加适配器

module可以是一个依赖或者相对地址

module例子:

```javascript
export const commands = [
    {
        name:"test",
        desc:"测试用命令",
        handler(...args){
            console.log("test命令:",...args)
        }
    }
]
```

## 例子

适配器例子:

packages/adapter-test

使用项目例子:

packages/demo

## 开发

PS:使用yarn 构建

packages/cli-test 通过cliver和适配器封装新的cli工具 

```javascript
#!/usr/bin/env node

import { buildCli } from 'cliver'
import { commands } from 'adapter-test'

buildCli({ commands })
```

```json
{
  "bin": {
    "cli-test": "module/index.js"
  },
}

```
