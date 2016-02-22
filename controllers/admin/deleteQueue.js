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
            .findByIdAndRemove(queueId)
            .exec()
            .then(
                function () {
                    res.json({
                        status: 0
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
