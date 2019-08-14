"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.commands = void 0;
const commands = [{
  name: "test",
  desc: "desc",

  handler(...args) {
    console.log('cwd', process.cwd());
    console.log('dirname', __dirname);
    console.log("test", ...args);
  }

}];
exports.commands = commands;