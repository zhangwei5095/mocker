/**
 * @file 队列model
 * @author Franck Chen(chenfan02@baidu.com)
 */

// 第三方依赖
var Promise = require('bluebird');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

mongoose.Promise = Promise;

// 连接数据库
var db = require('../lib/db');

// schema
var queueSchema = require('./schemas/queue');

// collection名
var collectionName = 'queue';

// 注册response
mongoose.model(collectionName, queueSchema);

// model对象
var Queue = db.model(collectionName, queueSchema);

/**
 * 新建队列
 *
 * @param {string} name 队列名称
 * @param {Array} responses 响应id集合
 * @return {Object}
 */
exports.add = function (name, responses) {
    return new Promise(function (resolve, reject) {
        // 校验
        if (!name || typeof name !== 'string') {
            reject('名称错误');
            return;
        }

        // 队列数据，内容参考schema
        var docData = {
            name: name
        };

        if (Array.isArray(responses)) {
            var i;
            var len;

            // 队列的长度不能超过10
            if (responses.length > 10) {
                reject('队列过长');
                return;
            }

            // 所有的id必须合法
            for (i = 0, len = responses.length; i < len; i++) {
                var responseId = responses[i];

                if (!ObjectId.isValid(responseId)) {
                    reject('队列中包含无效的响应id');
                    return;
                }
            }

            docData.responses = responses;
        }

        // 创建并保存
        var queue = new Queue(docData);
        queue
            .save()
            .then(
                function (queue) {
                    // 新建立的队列的id作为数据抛出
                    resolve(queue._id.toString());
                },
                reject
            );
    });
};
