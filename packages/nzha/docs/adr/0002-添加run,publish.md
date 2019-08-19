# 2. 添加run,publish

日期: 2019-08-18

## 状态

2019-08-18 提议

## 背景

依赖安装使用 hoist 方式安装
使得子项目没有node_module,无法执行npm run

## 决策

增加nezha run 去执行子命令
--scope 指定执行的包
--ignore 指定不执行的包

同时添加 publish 和 bootstrap

## 后果

在这里记录结果...
