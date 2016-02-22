/**
 * @file 获取响应集合的接口
 * @author Franck Chen(chenfan02@baidu.com)
 */

var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

var db = require('../../lib/db');

var Interface = db.model('interface');

module.exports = {
    method: 'post',
    controller: function (req, res, next) {
        // 需要获取响应列表的接口的id
        var interfaceId = req.body.interfaceId;

        if (!ObjectId.isValid(interfaceId)) {
            next({status: 1});
            return;
        }

        // 用户请求的需要列出的响应，目前有JSON,HTML,QUEUE
        var responseType = req.body.responseType;
        responseType = responseType ? responseType : 'JSON';

        if (responseType === 'JSON' || responseType === 'HTML') {
            Interface
                .findOne({_id: interfaceId})
                .select('responses activeResponse')
                .populate({
                    path: 'responses',
                    match: {
                        type: responseType
                    },
                    // populate目前激活的响应，需要的字段只有name
                    select: 'name type'
                })
                .lean()
                .exec()
                .then(
                    function (data) {
                        res.json({
                            status: 0,
                            responses: data.responses,
                            // 当前启动的响应的id
                            activeResponseId: data.activeResponse
                        });
                    },
                    function () {
                        res.json({
                            status: 1
                        });
                    }
                );
        }
        else if (responseType === 'QUEUE') {
            Interface
                .findOne({_id: interfaceId})
                .select('queues activeResponse')
                .populate(
                    {
                        path: 'queues',
                        select: 'name type'
                    }
                )
                .lean()
                .exec()
                .then(
                    function (doc) {
                        res.json({
                            status: 0,
                            responses: doc.queues,
                            activeResponseId: doc.activeResponse
                        });
                    },
                    function () {
                        res.json({
                            status: 1
                        });
                    }
                );
        }
        else {
            res.json({
                status: 1
            });
        }
    }
};
