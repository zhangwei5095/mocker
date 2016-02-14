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
            // 准确的查到了接口和激活响应
            //if (data.status === 0) {
            //}
            //else {
            //    // 为查到接口，或者查询到的接口没有可用且激活的响应
            //    res
            //        .status(404)
            //        .render('404', {
            //            title: '404你懂的~',
            //            errorInfo: data.statusInfo
            //        });
            //}
        },
        next
    );
};
