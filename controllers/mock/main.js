/**
 * @file 模拟数据返回controller
 * @author Franck Chen(chenfan02@baidu.com)
 */

// node
var URL = require('url');

// express
var express = require('express');

// model
var interfaceModel = require('../../model/interfaceModel');

module.exports = function (req, res, next) {
    var originalUrl = req.originalUrl;

    // 获取到用户请求的模拟接口地址，目前忽略查询字符串
    var urlObj = URL.parse(originalUrl);
    var url = urlObj.pathname.replace(/^\/mock\//, '');

    // 根据URL查询模拟数据
    var promise = interfaceModel.getActiveResponse(url);

    promise.then(
        function (response) {
            res.status(response.httpStatusCode);

            setTimeout(
                function () {
                    switch (response.type.toUpperCase()) {
                        case 'JSON':
                            res.json(response.data);
                            break;
                        case 'HTML':
                            res.type('html').end(response.data);
                            break;
                        default:
                            next();
                    }
                },
                response.delay
            );
        },
        function (data) {
            switch (data.status) {
                case 1:
                    // mongodb查询失败，错误比较严重，500
                    next();
                    break;
                // 2和3分别代码没有注册和未激活
                case 2:
                case 3:
                    res
                        .status(404)
                        .render('mock404', {
                            title: '404你懂的~',
                            errorInfo: data.statusInfo
                        });
                    break;
                default:
                    next();
            }
        }
    );
};
