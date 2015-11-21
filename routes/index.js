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
            // 准确的查到了接口和激活响应
            if (data.status === 0) {
                // 目前只支持JSON响应
                res.json(data.response);
            }
            else {
                // 为查到接口，或者查询到的接口没有可用且激活的响应
                res
                    .status(404)
                    .render('404', {
                        title: '404你懂的~',
                        errorInfo: data.statusInfo
                    });
            }
        },
        function () {
            // todo 500 系统错误页面
        }
    );
});

module.exports = router;
