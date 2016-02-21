/**
 * @file 队列编辑页接口
 * @author Franck Chen(chenfan02@baidu.com)
 */

// 第三方库
var mongoose = require('mongoose');
var async = require('async');

var db = require('../../lib/db');
var Interface = db.model('interface');
var Queue = db.model('queue');

var ObjectId = mongoose.Types.ObjectId;

module.exports = {
    method: 'get',
    controller: function (req, res, next) {
        var queryData = req.query;

        var interfaceId = queryData.interfaceId;
        var queueId = queryData.queueId;

        // 校验id的合法性
        if (!ObjectId.isValid(interfaceId)) {
            next({status: 0});
            return;
        }

        // 首屏数据
        var initData = {};

        async.waterfall(
            [
                function (callback) {
                    Interface
                        .findOne({_id: interfaceId})
                        .select('responses url')
                        .populate(
                            {
                                path: 'responses',
                                select: 'name type'
                            }
                        )
                        .exec()
                        .then(
                            function (doc) {
                                // 填充初始化数据
                                initData.responses = doc.responses;
                                initData.interfaceId = doc._id;
                                initData.interfaceURL = doc.url;
                                initData.name = doc.name;

                                callback(null);
                            },
                            function () {
                                callback(1);
                            }
                        );
                },
                function (callback) {
                    // 有queueId表示行为是编辑，需要查库
                    if (queueId) {
                        Queue
                            .findOne({_id: queueId})
                            .populate(
                                {
                                    path: 'responses',
                                    select: 'name type'
                                }
                            )
                            .exec()
                            .then(
                                function (queuedResponses) {
                                    // 已存在队列中的响应
                                    initData.queuedResponses = queuedResponses;
                                },
                                function () {
                                    callback(1);
                                }
                            );
                    }
                    // 不包含queueId,表示是新建
                    else {
                        initData.queuedResponses = [];
                        callback(null);
                    }
                }
            ],
            function (err) {
                if (err) {
                    next({status: 0});
                }
                else {
                    res.render('queueEdit', {
                        title:  '响应队列编辑',
                        initialData: JSON.stringify(initData)
                    });
                }
            }
        );
    }
};
