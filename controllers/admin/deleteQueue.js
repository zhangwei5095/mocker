/**
 * @file 删除指定的队列接口
 * @author Franck Chen(chenfan02@baidu.com)
 */

var mongoose = require('mongoose');

var db = require('../../lib/db');
var Queue = db.model('queue');

var ObjectId = mongoose.Types.ObjectId;

module.exports = {
    method: 'post',
    controller: function (req, res) {
        var queueId = req.body.id;

        if (!ObjectId.isValid(queueId)) {
            res.json({
                status: 1,
                statusInfo: 'id错误'
            });

            return;
        }

        Queue
            .findById(queueId)
            .exec()
            .then(
                function (doc) {
                    // 删除这个响应的document，特别注意不要直接调用model层的remove删除文档，否则无法触发middleware
                    doc.remove(function (err) {
                        res.json({
                            status: !err ? 0 : 1
                        });
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
};
