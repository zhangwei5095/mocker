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
            // waterline第一步，查找激活的响应的id
            function (callback) {
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
                            callback(null, doc);
                        },
                        function () {
                            callback(1, '查询失败');
                        }
                    );
            },
            // waterline第二步,populate响应
            function (doc, callback) {
                // 激活的响应是什么类型
                var activeResponseType = doc.activeResponseType;

                if (activeResponseType === 'JSON' || activeResponseType === 'HTML') {
                    // JSON和HTML同属响应，是一个collection,一种schema, populate
                    doc
                        .populate(
                            {
                                path: 'activeResponse',
                                model: 'response'
                            }
                        )
                        .execPopulate()
                        .then(
                            function (response) {
                                switch (response.type.toUpperCase()) {
                                    case 'JSON':
                                        res.json(response.data);
                                        break;
                                    case 'HTML':
                                        res.type('html').end(response.data);
                                        break;
                                    default:
                                        callback(1, '响应解析错误');
                                }
                            },
                            function () {
                                callback(1, '响应解析错误');
                            }
                        );
                }
                else if (activeResponseType === 'QUEUE') {
                    // 队列单独属于一个collection, populate
                    doc
                        .populate(
                            {
                                path: 'activeResponse',
                                model: 'queue'
                            }
                        )
                        .execPopulate()
                        .then(
                            function (queue) {
                                // 进入第三步
                                callback(null, queue);
                            },
                            function () {
                                callback(1, '队列查询失败');
                            }
                        );
                }
                else {
                    callback(1, '响应类型错误');
                }
            },
            // waterline第三步，处理queue,如果是JSON或者HTML响应的话是走不到这一步的
            function (queue, callback) {
                // populate, 因为队列中最多有10个响应，所以全部populate的话性能也能够接受
                queue
                    .populate(
                        {
                            path: 'responses'
                        }
                    )
                    .execPopulate()
                    .then(
                        function (queue) {
                            callback(null, queue.responses, queue.position)
                        },
                        function () {
                            callback(1, '队列响应解析错误');
                        }
                    );
            },
            // waterline第四步，主要是读取游标对应的响应，然后返回，并更新游标
            function (responses, position, callback) {
                if (position > responses.length) {
                    position = 0;
                }
                var response = responses[position];

                switch (response.type.toUpperCase()) {
                    case 'JSON':
                        res.json(response.data);
                        break;
                    case 'HTML':
                        res.type('html').end(response.data);
                        break;
                    default:
                        callback(1, '响应解析错误');
                }
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
