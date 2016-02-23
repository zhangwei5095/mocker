/**
 * @file 模拟数据返回controller
 * @author Franck Chen(chenfan02@baidu.com)
 */

// node
var URL = require('url');

// 第三方
var async = require('async');

// 引用模块
var db = require('../../lib/db');
var interfaceModel = require('../../model/interfaceModel');
var Interface = db.model('interface');

module.exports = function (req, res, next) {
    var originalUrl = req.originalUrl;

    // 获取到用户请求的模拟接口地址，目前忽略查询字符串
    var urlObj = URL.parse(originalUrl);
    var url = urlObj.pathname.replace(/^\/mock\//, '');

    aysnc.waterfall(
        [
            function (callback) {
                // waterline第一步，查找激活的响应的id
                Interface
                    .getActiveResponseByURL(url)
                    .then(
                        function (doc) {
                            if (!doc) {
                                // 没有doc，即这个url还没有注册成为接口，应该返回404
                                renderError({
                                    status: 2,
                                    statusInfo: '当前地址未被注册为接口'
                                });

                                return;
                            }

                            // 当前该接口激活的响应，目前只支持JSON
                            var activeResponse = doc.activeResponse;

                            if (!activeResponse) {
                                renderError({
                                    status: 3,
                                    statusInfo: '该接口没有处于激活状态的响应，请尝试激活'
                                });

                                return;
                            }

                            // 有激活的响应，waterline模式走向下一步
                            callback(null, activeResponse)
                        },
                        function () {
                            callback(1, '查询失败')
                        }
                    );
            },
            function (activeResponseId, callback) {

            }
        ],
        function (errStatus, errorInfo) {
            next({
                status: errStatus,
                errorInfo: errorInfo
            });
        }
    );

    function renderError(data) {
        switch (data.status) {
            case 1:
                // mongodb查询失败，错误比较严重，500
                next({status: 0});
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
                next({status: 0});
        }
    }

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
                            next({status: 0});
                    }
                },
                response.delay
            );
        }
    );
};
