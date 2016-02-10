/**
 * @file 获取响应集合的接口
 * @author Franck Chen(chenfan02@baidu.com)
 */

var interfaceModel = require('../../model/interfaceModel');

module.exports = {
    method: 'post',
    controller: function (req, res) {
        // 需要获取响应列表的接口的id
        var interfaceId = req.body.interfaceId;

        var promise = interfaceModel.getResponseList(interfaceId);

        promise.then(
            function (data) {
                res.json({
                    responses: data.responses,
                    // 当前启动的响应的id
                    activeResponseId: data.activeResponseId
                });
            }
        );
    }
};
