/**
 * @file 商桥mocker平台管理接口Router
 * @author Franck Chen(chenfan02@baidu.com)
 * @date 2015-10-23
 */

// Express
var express = require('express');
var router = express.Router();

// 第三方
var Q = require('q');

// 模块
var interfaceModel = require('../model/interfaceModel');
var responseModel = require('../model/responseModel');

/**
 * 新添接口接口
 */
router.post('/addInterfaceURL', function (req, res) {
    // post数据，由body parser自动解析
    var postData = req.body;
    var newInterfaceURL = postData.url;
    var dataType = postData.type ? postData.type : 'JSON';

    // 调用model层接口，注册新接口
    var promise = interfaceModel.registerNewInterface(newInterfaceURL, dataType);

    promise.then(
        function (data) {
            res.json(data);
        },
        function () {
            res.json({
                status: 1,
                statusInfo: '错误'
            });
        }
    );
});

/**
 * 获取全部已注册接口的ajax接口
 */
router.post('/getAllInterface', function (req, res) {
    var promise = interfaceModel.getInterfaceList();

    promise.then(
        function (data) {
            res.json({
                interfaceList: data.interfaceList
            });
        }
    );
});

// 获取响应集合的接口
router.post('/getResponseList', function (req, res) {
    // 需要获取响应列表的接口的id
    var interfaceId = req.body.interfaceId;

    var promise = interfaceModel.getResponseList(interfaceId);

    promise.then(
        function (data) {
            res.json({
                responses: data.responses,
                // 当前启动的响应的id
                activeResponseId: data.activeResponseId
            });
        }
    );
});

/**
 * JSON响应新增、修改接口
 */
router.post('/saveJSONResponse', function (req, res, next) {
    var postData = req.body;
    var interfaceId = postData.interfaceId;
    var responseId = postData.responseId;
    var responseName = postData.responseName;
    var responseData = postData.responseData;

    // promise
    var deferred = Q.defer();
    var promise = deferred.promise;

    if (!interfaceId && !responseId) {
        next();
    }

    // 如果有responseId则表示这个提交的目的是保存
    if (responseId) {
        responseModel
            .updateResponseDataById(
                responseId,
                {
                    name: responseName,
                    data: responseData
                }
            )
            .then(
                function (response) {
                    deferred.resolve(response);
                },
                deferred.reject
            );
    }
    else {
        // 保存响应是一定需要有接口id的
        if (!interfaceId) {
            deferred.reject();
        }
        else {
            // 没有给responseId表示是新建
            interfaceModel
                .addNewJSONRes(
                    interfaceId,
                    responseName,
                    responseData
                )
                .then(
                    function (response) {
                        deferred.resolve(response);
                    },
                    deferred.reject
                );
        }
    }

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
                response: response
            });
        },
        function () {
            res.json({
                status: SAVE_STATUS.FAILED
            });
        }
    );
});

/**
 * 修改接口激活响应接口
 */
router.post('/setActiveResponse', function (req, res, next) {
    // post数据,由body-parser解析
    var postData = req.body;

    var interfaceId = postData.interfaceId;
    var responseId = postData.responseId;

    // 更新启用的id
    var promise = interfaceModel.setActiveResponse(interfaceId, responseId);

    promise.then(
        function () {
            res.json({
                status: 0
            });
        },
        next
    );
});

/**
 * 删除指定响应ajax接口
 */
router.post('/deleteResponse', function (req, res) {
    // post数据,由body-parser解析
    var postData = req.body;

    // 需要删除的响应的id
    var responseId = postData.responseId;

    if (!responseId || typeof responseId !== 'string') {
        // 没有提供有效id直接报错
        res.json({
            status: 1,
            statusInfo: '请提供有效的响应id'
        });
    }

    // model层删除对应的响应
    var promise = responseModel.deleteResponseById(responseId);

    promise.then(
        function () {
            res.json({
                status: 0
            });
        },
        function () {}
    );
});

module.exports = router;
