// express
var express = require('express');
var router = express.Router();

var interfaceModel = require('../model/interfaceModel');

// 管理页面
router.get('/admin', function (req, res, next) {
    res.render('interfaceList', {
        // mock平台的地址+端口
        hostBaseURL: req.get('host')
    });
});

// 模拟JSON返回的接口
router.use('*', function(req, res, next) {
    // 获取到用户请求的模拟接口地址
    var url = req.originalUrl.replace(/^\//, '');

    var promise = interfaceModel.getActiveResponse(url);

    promise.then(
        function (data) {
            res.end(JSON.stringify(data.response.data));
        }
    );
});

module.exports = router;
