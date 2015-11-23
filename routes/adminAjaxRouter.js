/**
 * @file 商桥mocker平台管理接口Router
 * @author Franck Chen(chenfan02@baidu.com)
 * @date 2015-10-23
 */

// Express
var express = require('express');
var router = express.Router();

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
            // TODO
            res.end('错误');
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
                responseData: data.responses,
                // 当前启动的响应的id
                activeResponseId: data.activeResponseId
            });
        }
    );
});

/**
 * 编辑JSON响应ajax接口
 */
router.post('/editRes', function (req, res) {
    // post数据
    var postData = req.body;

    var responseId = postData.responseId;
    var responseName = postData.name;
    var dataValue = postData.value;

    // 以id为依据更新响应
    var promise = responseModel.updateResponseDataById(
        responseId,
        {
            name: responseName,
            // TODO 目前只支持json
            data: dataValue
        }
    );

    promise.then(
        function () {
            // 更新成功后
            res.json({
                status: 0
            });
        },
        function () {
            res.json({
                status: 1
            });
        }
    );
});

/**
 * 添加新JSON响应ajax接口
 */
router.post('/addNewJSONRes', function (req, res) {
    // post数据
    var postData = req.body;

    var interfaceId = postData.interfaceId;
    var responseName = postData.name;
    var dataValue = postData.value;

    // 添加新的JSON相应
    var promise = interfaceModel.addNewJSONRes(interfaceId, responseName, dataValue);

    promise.then(
        // 新创建的json响应保存成功了，将这个响应的id返回给前端
        function (responseData) {
            res.json({
                status: 0,
                // 响应id
                responseId: responseData.responseId
            });
        },
        function () {}
    );
});

/**
 * 修改接口激活响应接口
 */
router.post('/setActiveResponse', function (req, res) {
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
        function () {}
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
