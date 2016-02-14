/**
 * @file 响应列表页接口
 * @author Franck Chen(chenfan02@baidu.com)
 */

var interfaceModel = require('../../model/interfaceModel');

module.exports = {
    method: 'get',
    controller: function (req, res, next) {
        // 以这个接口id为基础查找响应
        var interfaceId = req.query.interfaceId;

        // 不能没有interfaceId
        if (!interfaceId) {
            next({status: 0});
            return;
        }

        // 活接响应数据
        var promise = interfaceModel.getResponseList(interfaceId);

        promise.then(
            function (data) {
                res.render('responseList', {
                    title: '响应总览',
                    // 首屏数据
                    initialData: JSON.stringify({
                        interfaceId: interfaceId,
                        responses: data.responses,
                        activeResponseId: data.activeResponseId,
                        interfaceURL: data.interfaceURL
                    })
                });
            },
            function () {
                next({status: 0});
            }
        );
    }
};
