// Express
var express = require('express');
var router = express.Router();

var interfaceModel = require('../model/interfaceModel');
var responseModel = require('../model/responseModel');

/**
 * 管理页面主页
 */
router.get('/', function (req, res, next) {
    res.render('interfaceList', {
        // mock平台的地址+端口
        hostBaseURL: req.get('host'),
        title: '注册接口总览'
    });
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
                res.render('jsonViewer', {
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
                res.render('jsonViewer', {
                    response: data.response,
                    title: 'JSON响应编辑'
                });
            }
        );
    }
});

// 指定接口的响应列表界面
router.get('/responseSurvey', function (req, res, next) {
    res.render('responseSurvey', {
        title: '响应总览'
    });
});

module.exports = router;
