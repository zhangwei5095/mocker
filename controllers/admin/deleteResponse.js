/**
 * @file 商桥mocker平台管理接口Router
 * @author Franck Chen(chenfan02@baidu.com)
 */

var responseModel = require('../../model/responseModel');

module.exports = {
    method: 'post',
    controller: function (req, res) {
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
        var promise = responseModel.deleteById(responseId);

        promise.then(
            function () {
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
    }
};
