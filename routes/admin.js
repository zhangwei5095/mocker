// Express
var express = require('express');
var router = express.Router();

var interfaceModel = require('../model/interfaceModel');
var responseModel = require('../model/responseModel');

router.get('/newJSONResponse', function(req, res, next) {
    // 从查询字符串中获取interfaceID
    var interfaceID = req.query.interfaceID;
    var promise = null;

    if (interfaceID) {
        promise = interfaceModel.getInterfaceDataById(interfaceID);

        promise.then(
            function (data) {
                res.render('jsonViewer', {
                    id: data.data._id,
                    data: data.data
                });
            }
        );
    }
});

router.get('/editResponse', function(req, res, next) {
    // 从查询字符串中获取interfaceID
    var responseId = req.query.responseId;
    var promise = null;

    if (responseId) {
        promise = responseModel.getResponseDataById(responseId);

        promise.then(
            function (data) {
                res.render('jsonViewer', {
                    response: data.response
                });
            }
        );
    }
});

// 指定接口的响应列表界面
router.get('/responseSurvey', function (req, res, next) {
    res.render('responseSurvey', {});
});

module.exports = router;
