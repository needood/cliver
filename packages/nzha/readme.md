# nzha

nzha 是一个快速构建monorepo项目的手脚架.

它可以方便你初始化monorepo,初始化子项目的工具,运行子项目脚本等操作;

它是一个简化版本的lerna

它基于cliver,可以使用cliver所有特征

## 快速使用

### 新建一个项目:

```
cd proj1
nzha init
```

### 新建一个子项目

```
nzha new subProj1
```

### 安装依赖

```
nzha bootstrap
```

PS:子项目依赖统一安装在主项目的node_modules
PS2:在安装时不触发运行脚本(目前)

### 运行子项目脚本

```
nzha run [name]
```

name 为 脚本名,运行所以子项目中名称为name的脚本
PS: 忽略子项目 --ignore, 特定子项目 --target (未开发)

### 发布

```
nzha publish
```

PS: (未开发)
PS: 忽略子项目 --ignore, 特定子项目 --target (未开发)

## 项目特性

初始化的monorepo项目集成了通过babel编码代码的能力

可使用 nzha run watch 或者 nzha run prepublish 进行编码

根据变量编码出不同版本代码. 默认的lib版本是保证nodejs6以上版本可运行,具体可根据个人需要在配置主项目下的babel配置文件;
该版本下,依赖 'project/src' 文件会生产 project/lib 文件并且你的require也会自动转换