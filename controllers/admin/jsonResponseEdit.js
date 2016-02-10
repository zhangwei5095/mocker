/**
 * @file JSON编辑页面接口
 * @author Franck Chen(chenfan02@baidu.com)
 */

// 第三方
var Promise = require('bluebird');

// model
var responseModel = require('../../model/responseModel');

module.exports = {
    method: 'get',
    controller: function(req, res, next) {
        // 从查询字符串中获取interfaceID
        var interfaceId = req.query.interfaceId;
        var responseId = req.query.responseId;

        // 首屏数据
        var initData = {
            interfaceId: interfaceId
        };

        var promise = new Promise(function (resolve, reject) {
            // interfaceId是一定要有的
            if (!interfaceId) {
                next();
            }

            // 如果有responseId表示是编辑，这时候需要查数据库
            if (responseId) {
                responseModel
                    .getResponseDataById(responseId)
                    .then(
                        function (response) {
                            // 填充首屏数据
                            initData.response = response;
                            initData.responseId = response._id;

                            resolve();
                        },
                        reject
                    );
            }
            else {
                // 没有responseId的话是新建动作，不需要异步处理
                resolve();
            }
        });

        promise.then(
            function () {
                res.render('jsonResponseEdit', {
                    title: 'JSON响应编辑',
                    initialData: JSON.stringify(initData),
                    interfaceId: interfaceId
                });
            },
            next
        );
    }
};
