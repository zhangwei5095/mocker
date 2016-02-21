/**
 * @file JSON响应新增、修改接口
 * @author Franck Chen(chenfan02@baidu.com)
 */

// 第三方
var mongoose = require('mongoose');
var async = require('async');

// 引用模块
var db = require('../../lib/db');
var Queue = db.model('queue');
var Interface = db.model('interface');

var ObjectId = mongoose.Types.ObjectId;

module.exports = {
    method: 'post',
    controller: function (req, res, next) {
        // post数据
        var postData = req.body;
        var queueId = postData.queueId;
        var interfaceId = postData.interfaceId;

        // 校验id的合法性
        if (!ObjectId.isValid(interfaceId)) {
            next({status: 0});
            return;
        }

        if (queueId && !ObjectId.isValid(queueId)) {
            next({status: 0});
            return;
        }

        var queueName = postData.name;
        var responses = postData.responses;
        var position = postData.position || 0;

        // 类型及长度校验
        if (!Array.isArray(responses) || (responses.length > 10)) {
            next({status: 0});
            return;
        }

        // id逐一校验
        var i;
        var len;
        for (i = 0, len = responses.length; i < len; i++) {
            var responseId = responses[i];

            if (!ObjectId.isValid(responseId)) {
                next({status: 0});
                return;
            }
        }

        // 未提供queue id，表示是新建逻辑
        if (!queueId) {
            async.waterfall(
                [
                    function (callback) {
                        // 新建并入库保存，注意position在schema中有default值所以不需要提供
                        var queue = new Queue({
                            name: queueName
                        });
                        queue
                            .save()
                            .then(
                                function (doc) {
                                    callback(null, doc.toObject());
                                },
                                function () {
                                    callback(1);
                                }
                            );
                    },
                    function (queue, callback) {
                        Interface
                            .findOne({_id: interfaceId})
                            .update(
                                {
                                    // 去重，保存至接口的队列中
                                    $addToSet: {
                                        queues: queue._id
                                    }
                                }
                            )
                            .exec()
                            .then(
                                function () {
                                    callback(null, queue._id);
                                },
                                function () {
                                    // TODO 引入Transaction
                                    callback();
                                }
                            );
                    }
                ],
                function (err, info) {
                    var data = {
                        status: !err ? 0 : 1
                    };

                    if (!err) {
                        data.queueId = info;
                    }

                    res.json(data);
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
