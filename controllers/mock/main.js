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

    async.waterfall(
        [
            // waterfall第一步，查找激活的响应的id
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
            // waterfall第二步,populate响应
            function (interfaceDoc, callback) {
                // 激活的响应是什么类型
                var activeResponseType = interfaceDoc.activeResponseType;

                if (activeResponseType === 'JSON' || activeResponseType === 'HTML') {
                    // JSON和HTML同属响应，是一个collection,一种schema, populate
                    interfaceDoc
                        .populate(
                            {
                                path: 'activeResponse',
                                model: 'response'
                            }
                        )
                        .execPopulate()
                        .then(
                            function (interfaceDoc) {
                                sendResponse(interfaceDoc.activeResponse)
                            },
                            function () {
                                callback(1, '响应解析错误');
                            }
                        );
                }
                else if (activeResponseType === 'QUEUE') {
                    // 队列单独属于一个collection, populate
                    interfaceDoc
                        .populate(
                            {
                                path: 'activeResponse',
                                model: 'queue'
                            }
                        )
                        .execPopulate()
                        .then(
                            function (interfaceDoc) {
                                // 进入第三步,注意此时的activeResponse就是队列文档
                                callback(null, interfaceDoc.activeResponse);
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
            // waterfall第三步，处理queue,如果是JSON或者HTML响应的话是走不到这一步的
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
                            callback(null, queue)
                        },
                        function () {
                            callback(1, '队列响应解析错误');
                        }
                    );
            },
            // waterfall第四步，主要是读取游标对应的响应，然后返回，并更新游标
            function (queue, callback) {
                // 队列游标
                var position = queue.position;
                // 队列中的响应
                var responses = queue.responses;

                // 如果队列中没有任何响应的话，404
                if (responses.length === 0) {
                    renderError({
                        status: 3,
                        statusInfo: '队列为空'
                    });

                    return;
                }

                var nextPosition;
                // 游标位置大约队列长度，这种情况在删除了响应以后可能会出现，这个时候调整游标就ok了
                if (position > responses.length) {
                    position = 0;
                    nextPosition = 1;
                }
                else {
                    nextPosition = position++;
                }

                // 更新游标
                queue
                    .update(
                        {
                            $set: {
                                position: nextPosition
                            }
                        }
                    )
                    .exec()
                    .then(
                        function () {
                            var response = responses[position];

                            sendResponse(response);
                        },
                        function () {
                            callback(1, '队列游标更新出错');
                        }
                    );
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
            // 2和3分别代码没有注册和未激活, 4表示队列为空
            case 2:
            case 3:
            case 4:
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

    function sendResponse(response) {
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
};
