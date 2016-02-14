/**
 * @file express程序入口
 * @author Franck Chen(chenfan02@baidu.com)
 * @date 2015-11-22
 */

// node
var path = require('path');

// express
var express = require('express');
var app = express();

// 中间件
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// routers
var admin = require('./routes/admin');
var mock = require('./routes/mock');

// 设置模板引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// 注册helper
require('./lib/handlebarsHelpers/extend');

/**
 * 注册中间件
 */
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
 * 404处理
 */
app.use(function (req, res, next) {
    // 0-99不和http状态码冲突，留给业务使用
    next({
        status: 404
    });
});

/**
 * 错误处理
 */
app.use(function (err, req, res, next) {
    var errStatus = err.status || 0;

    // 错误状态码是否是HTTP状态码，HTTP状态码是3位数
    // 如果不是3位数就是mock系统自定义错误状态码
    var isHTTPStatus = errStatus >= 100;

    // 模板名称
    var templateName = '';
    var renderData = {};

    // 如果不是指定的状态码，就返回500 - Internal Server Error
    var HTTPStatusCode = isHTTPStatus ? errStatus : 500;
    res.status(HTTPStatusCode);

    if (errStatus === 404) {
        templateName = '404';
        renderData.errorInfo = '...啥也没有';
    }
    else {
        templateName = 'error';
        renderData.errorInfo = err.errorInfo || '';
    }

    res.render(templateName, renderData);
});

module.exports = app;
