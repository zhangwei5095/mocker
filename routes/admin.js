/**
 * @file 后台管理同步接口router
 * @author Franck Chen(chenfan02@baidu.com)
 */

// node
var path = require('path');

// Express
var express = require('express');
var router = express.Router();

// 第三方
var globSync = require('glob').sync;

// 控制器的位置
var controllerPath = '../controllers/admin';

// 自动匹配并挂载所有管理同步接口
var files = globSync(
    '*.js',
    {
        cwd: controllerPath
    }
);
files.forEach(function (file) {
    // 删除后缀
    var relativePath = file.substr(0, file.lastIndexOf('.'));
    var module = require(path.join(controllerPath, relativePath));

    // HTTP方法
    var method = module.method;
    var controller = module.controller;

    // index文件挂载在跟路径下，默认
    if (relativePath === 'index') {
        router[method]('/', controller);
    }
    else {
        router[method]('/' + relativePath, controller);
    }
});

module.exports = router;
