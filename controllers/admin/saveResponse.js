/**
 * @file JSON响应新增、修改接口
 * @author Franck Chen(chenfan02@baidu.com)
 */

// 第三方
var Promise = require('bluebird');

var interfaceModel = require('../../model/interfaceModel');
var responseModel = require('../../model/responseModel');

module.exports = {
    method: 'post',
    controller: function (req, res, next) {
        var postData = req.body;

        var interfaceId = postData.interfaceId;
        var responseId = postData.responseId;
        var responseName = postData.responseName;
        var responseData = postData.responseData;
        var responseType = postData.type;
        var delay = postData.delay;
        var httpStatusCode = postData.httpStatusCode;

        var promise = new Promise(function (resolve, reject) {
            if (!interfaceId && !responseId) {
                next();
            }

            // 如果有responseId则表示这个提交的目的是保存
            if (responseId) {
                responseModel
                    .updateById(
                        responseId,
                        {
                            name: responseName,
                            responseType: responseType,
                            delay: delay || 0,
                            httpStatusCode: httpStatusCode || 200,
                            data: responseData
                        }
                    )
                    .then(
                        function (response) {
                            resolve(response);
                        },
                        reject
                    );
            }
            else {
                // 保存响应是一定需要有接口id的
                if (!interfaceId) {
                    reject();
                }
                else {
                    // 没有给responseId表示是新建
                    interfaceModel
                        .addResponse(interfaceId, responseName, responseType, responseData)
                        .then(
                            function (response) {
                                resolve(response);
                            },
                            reject
                        );
                }
            }
        });

        /**
         * 保存结果枚举
         * @enum
         */
        var SAVE_STATUS = {
            SUCCESS: 0,
            FAILED: 1
        };

        promise.then(
            function (response) {
                res.json({
                    status: SAVE_STATUS.SUCCESS,
                    // 保存成功的响应的id
                    responseId: response._id
                });
            },
            function () {
                res.json({
                    status: SAVE_STATUS.FAILED
                });
            }
        );
    }
};
