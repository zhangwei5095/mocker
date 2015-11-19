/**
 * @file 商桥mocker平台管理接口Router
 * @author Franck Chen(chenfan02@baidu.com)
 * @date 2015-10-23
 */

// Express
var express = require('express');
var router = express.Router();

// 模块
var model = require('../model/db');
var interfaceModel = require('../model/interfaceModel');

/**
 * 新添接口接口
 */
router.post('/addInterfaceURL', function(req, res) {
    // post数据，由body parser自动解析
    var postData = req.body;
    var newInterfaceURL = postData.url;
    var dataType = postData.type ? postData.type : 'JSON';

    // 调用model层接口，注册新接口
    var promise = interfaceModel.registerNewInterface(newInterfaceURL, dataType);

    promise.then(
        function (data) {
            res.end(JSON.stringify(data));
        },
        function () {
            res.end('错误');
        }
    );
});

router.post('/getAllInterface', function(req, res) {
    var promise = interfaceModel.getInterfaceList();

    promise.then(
        function (data) {
            res.end(JSON.stringify({
                interfaceList: data.interfaceList
            }));
        }
    );
});

// 获取响应集合的接口
router.post('/getResponseList', function(req, res) {
    // 需要获取响应列表的接口的id
    var interfaceId = req.body.interfaceId;

    var promise = interfaceModel.getReposeList(interfaceId);

    promise.then(
        function (data) {
            res.end(
                JSON.stringify({
                    responseData: data.responses
                })
            );
        }
    );
});

/**
 * 添加新JSON响应接口
 */
router.post('/editRes', function (req, res) {
    // post数据
    var postData = req.body;

    var interfaceId = postData.interfaceId;
    var responseName = postData.name;
    var dataValue = postData.value;

    // 添加新的JSON相应
    interfaceModel.addNewJSONRes(interfaceId, responseName, dataValue);

    res.end('ok!');
});

router.post('/addNewJSONRes', function (req, res) {
    // post数据
    var postData = req.body;

    var interfaceId = postData.interfaceId;
    var responseName = postData.name;
    var dataValue = postData.value;

    // 添加新的JSON相应
    interfaceModel.addNewJSONRes(interfaceId, responseName, dataValue);

    res.end('ok!');
});


module.exports = router;
