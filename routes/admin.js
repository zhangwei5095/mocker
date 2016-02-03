// Express
var express = require('express');
var router = express.Router();

// model
var interfaceModel = require('../model/interfaceModel');
var responseModel = require('../model/responseModel');

/**
 * 管理页面主页,列出所有接口
 */
router.get('/', function (req, res, next) {
    var promise = interfaceModel.getInterfaceList();

    promise.then(
        function (data) {
            res.render('interfaceList', {
                title: '注册接口总览',
                // 首屏需要的数据,尽量减少一个AJAX请求
                initialData: JSON.stringify({
                    interfaceList: data.interfaceList,
                    // mock平台的地址+端口
                    hostURL: req.get('host')
                })
            });
        },
        function () {
            next();
        }
    );
});

/**
 * 新增JSON响应
 */
router.get('/newJSONResponse', function(req, res, next) {
    // 从查询字符串中获取interfaceID
    var interfaceId = req.query.interfaceId;
    var promise = null;

    if (interfaceId) {
        promise = interfaceModel.getInterfaceDataById(interfaceId);

        promise.then(
            function () {
                res.render('jsonResponseEdit', {
                    title: 'JSON响应编辑'
                });
            }
        );
    }
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
            function (data) {
                res.render('jsonResponseEdit', {
                    response: data.response,
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
        function () {
            next();
        }
    );
});

module.exports = router;
