/**
 * @file 响应编辑页面接口
 * @author Franck Chen(chenfan02@baidu.com)
 */

// 第三方
var Promise = require('bluebird');

// model
var responseModel = require('../../model/responseModel');

module.exports = {
    method: 'get',
    controller: function (req, res, next) {
        var query = req.query;
        // 从查询字符串中获取interfaceID
        var interfaceId = query.interfaceId;
        var responseId = query.responseId;
        var interfaceURL = query.interfaceURL;

        // 首屏数据
        var initData = {
            interfaceId: interfaceId,
            interfaceURL: interfaceURL,
            httpStatusCode: 200,
            delay: 0
        };

        var promise = new Promise(function (resolve, reject) {
            // interfaceId是一定要有的
            if (!interfaceId) {
                reject();
                return;
            }

            // 如果有responseId表示是编辑，这时候需要查数据库
            if (responseId) {
                responseModel
                    .getById(responseId, {})
                    .then(
                        function (response) {
                            // 填充首屏数据
                            initData.response = response;
                            initData.responseId = response._id;
                            // 编辑的是哪一种数据，目前支持JSON和HTML
                            initData.type = response.type;
                            initData.httpStatusCode = response.httpStatusCode;
                            initData.delay = response.delay;

                            resolve();
                        },
                        reject
                    );
            }
            else {
                // 没有responseId的话是新建动作，不需要异步处理
                initData.type = req.query.type;

                // 新建必须提供类型
                if (!initData.type) {
                    reject();
                    return;
                }

                resolve();
            }
        });

        promise.then(
            function () {
                res.render('responseEdit', {
                    title: initData.type.toUpperCase() + '响应编辑',
                    initialData: JSON.stringify(initData),
                    interfaceId: interfaceId
                });
            },
            function () {
                next({status: 0});
            }
        );
    }
};
