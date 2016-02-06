// Express
var express = require('express');
var router = express.Router();

// model
var interfaceModel = require('../model/interfaceModel');
var responseModel = require('../model/responseModel');

// 第三方
var Q = require('q');

/**
 * 管理页面主页,列出所有接口
 */
router.get('/', function (req, res, next) {
    var promise = interfaceModel.getInterfaceList();

    promise.then(
        function (interfaceList) {
            res.render('interfaceList', {
                title: '注册接口总览',
                // 首屏需要的数据,尽量减少一个AJAX请求
                initialData: JSON.stringify({
                    interfaceList: interfaceList,
                    // mock平台的地址+端口
                    hostURL: req.get('host')
                })
            });
        },
        next
    );
});

/**
 * JSON响应编辑页面接口
 */
router.get('/jsonResponseEdit', function(req, res, next) {
    // 从查询字符串中获取interfaceID
    var interfaceId = req.query.interfaceId;
    var responseId = req.query.responseId;

    // promise
    var deferred = Q.defer();
    var promise = deferred.promise;

    // interfaceId是一定要有的
    if (!interfaceId) {
        next();
    }

    // 首屏数据
    var initData = {
        interfaceId: interfaceId
    };

    // 如果有responseId表示是编辑，这时候需要查数据库
    if (responseId) {
        responseModel
            .getResponseDataById(responseId)
            .then(
                function (response) {
                    // 填充首屏数据
                    initData.response = response;

                    deferred.resolve();
                },
                deferred.reject
            );
    }
    else {
        // 没有responseId的话是新建动作，不需要异步处理
        deferred.resolve();
    }

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
});

/**
 * 编辑某个JSON响应
 */
router.get('/editResponse', function(req, res, next) {
    // 从查询字符串中获取interfaceID
    var responseId = req.query.responseId;
    var promise = null;

    if (responseId) {
        promise = responseModel.getResponseDataById(responseId);

        promise.then(
            function (response) {
                res.render('jsonResponseEdit', {
                    response: response,
                    title: 'JSON响应编辑'
                });
            }
        );
    }
});

/**
 * 获取接口列表页接口
 */
router.get('/responseList', function (req, res, next) {
    // 以这个接口id为基础查找响应
    var interfaceId = req.query.interfaceId;

    // 不能没有interfaceId
    if (!interfaceId) {
        next();
        return;
    }

    // 活接响应数据
    var promise = interfaceModel.getResponseList(interfaceId);

    promise.then(
        function (data) {
            res.render('responseList', {
                title: '响应总览',
                // 首屏数据
                initialData: JSON.stringify({
                    interfaceId: interfaceId,
                    responses: data.responses,
                    activeResponseId: data.activeResponseId
                })
            });
        },
        next
    );
});

module.exports = router;
