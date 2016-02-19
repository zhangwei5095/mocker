/**
 * @file JSON响应新增、修改接口
 * @author Franck Chen(chenfan02@baidu.com)
 */

var mongoose = require('mongoose');

var db = require('../../lib/db');
var Queue = db.model('interface');

var ObjectId = mongoose.Types.ObjectId;

module.exports = {
    method: 'post',
    controller: function (req, res, next) {
        var queueId = req.query.queueId;

        // 校验id的合法性
        if (!ObjectId.isValid(queueId)) {
            next({status: 0});
            return;
        }

        // post数据
        var postData = req.body;
        var queueName = postData.name;
        var responses = postData.responses;
        var position = postData.position || 0;

        // 类型及长度校验
        if (!Array.isArray(responses) && (responses.length > 10)) {
            next({status: 0});
            return;
        }

        // id逐一校验
        var i;
        var len;
        for (i = 0, len = responses.length; i < len; i++) {
            if (!ObjectId.isValid(responseId)) {
                next({status: 0});
                return;
            }
        }

        // 新建逻辑
        if (queueId) {
            // 新建并入库保存，注意position在schema中有default值所以不需要提供
            var queue = new Queue({
                name: queueName
            });
            queue
                .save()
                .then(
                    function (doc) {
                        doc = doc.toObject();

                        res.json({
                            status: 0,
                            queueId: doc._id
                        });
                    },
                    function () {
                        res.json({
                            status: 1,
                            statusInfo: '保存失败'
                        });
                    }
                );
        }
        // 保存逻辑
        else {
            Queue
                .find({_id: queueId})
                .update({
                    $set: {
                        name: queueName,
                        responses: responses,
                        position: position
                    }
                })
                .exec()
                .then(
                    function (doc) {
                        doc = doc.toObject();

                        res.json({
                            status: 0,
                            queueId: doc._id
                        });
                    },
                    function () {
                        res.json({
                            status: 1,
                            statusInfo: '更新失败'
                        });
                    }
                );
        }
    }
};
