/**
 * @file 修改接口激活响应接口
 * @author Franck Chen(chenfan02@baidu.com)
 */

var interfaceModel = require('../../model/interfaceModel');

module.exports = {
    method: 'post',
    controller: function (req, res, next) {
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
    }
};
