"use strict";

require("core-js/modules/es.array.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.commands = void 0;
var commands = [{
  name: "test",
  desc: "测试用命令",

  handler(...args) {
    console.log('cwd', process.cwd());
    console.log('dirname', __dirname);
    console.log("test", ...args);
  }

}];
exports.commands = commands;