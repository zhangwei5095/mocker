/**
 * @file express程序入口
 * @author Franck Chen(chenfan02@baidu.com)
 * @date 2015-11-22
 */

// 原生模块
var path = require('path');

// express
var express = require('express');

// 中间件
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// routers
var admin = require('./routes/admin');
var mock = require('./routes/mock');

var app = express();

// 设置模板引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// 注册helper
require('./lib/handlebarsHelpers/extend');

// 挂载中间件
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * router 注意挂载顺序
 */
// 管理页面路由
app.use('/admin', admin);
// mock路由
app.use('/mock', mock);

/**
 * 无法匹配到响应会走到这里
 */
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// 开发环境下应答错误信息
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// 生产环境下友好提示
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
