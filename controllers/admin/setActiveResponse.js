/**
 * @file 修改接口激活响应接口
 * @author Franck Chen(chenfan02@baidu.com)
 */

var interfaceModel = require('../../model/interfaceModel');

module.exports = {
    method: 'post',
    controller: function (req, res, next) {
        // post数据
        var postData = req.body;

        var interfaceId = postData.interfaceId;
        var activeResponseId = postData.activeResponseId;

        // 更新启用的id
        var promise = interfaceModel.setActiveResponse(interfaceId, activeResponseId);

        promise.then(
            function () {
                res.json({
                    status: 0
                });
            },
            function () {
                next({status: 0});
            }
        );
    }
};
