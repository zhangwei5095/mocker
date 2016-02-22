/**
 * @file 响应列表页接口
 * @author Franck Chen(chenfan02@baidu.com)
 */

var mongoose = require('mongoose');

var db = require('../../lib/db');

var Interface = db.model('interface');
var ObjectId = mongoose.Types.ObjectId;

module.exports = {
    method: 'get',
    controller: function (req, res, next) {
        // 以这个接口id为基础查找响应
        var interfaceId = req.query.interfaceId;

        // 不能没有interfaceId
        if (!ObjectId.isValid(interfaceId)) {
            next({status: 0});
            return;
        }

        // 默认情况下，获取的是JSON响应列表
        var type = req.query.type;
        type = type ? type : 'JSON';

        Interface
            .findOne({_id: interfaceId})
            .select('responses url activeResponse')
            .populate({
                path: 'responses',
                // 根据类型查询
                match: {
                    type: type
                },
                // populate目前激活的响应，需要的字段只有name
                select: 'name type'
            })
            .lean()
            .exec()
            .then(
                function (data) {
                    res.render('responseList', {
                        title: '响应总览',
                        // 首屏数据
                        initialData: JSON.stringify({
                            interfaceId: interfaceId,
                            responses: data.responses,
                            activeResponseId: data.activeResponse,
                            interfaceURL: data.url
                        })
                    });
                },
                function () {
                    next({status: 0});
                }
            );
    }
};
