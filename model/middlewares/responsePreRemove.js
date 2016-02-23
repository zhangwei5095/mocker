/**
 * @file 响应document删除前的中间件
 * @author Franck Chen(chenfan02@baidu.com)
 */

var async = require('async');

module.exports = function (next) {
    var Interface = this.model('interface');
    var Queue = this.model('queue');
    // 正在准备删除的document
    var thisDoc = this.toObject();

    async.waterfall(
        [
            function (callback) {
                Interface
                    .update(
                        // 第一个参数是查询条件
                        {
                            // 查找所有包含这个响应的接口
                            responses: {
                                $in: [thisDoc._id]
                            }
                        },
                        {
                            // 剔除这个节点的ref
                            $pull: {
                                responses: thisDoc._id
                            },
                            // 已注册的响应数量减1
                            $inc: {
                                responseCount: -1
                            }
                        },
                        {
                            // 虽然现在响应只对应一个接口，为未来扩展，所有接口都更新下
                            multi: true
                        }
                    )
                    .exec()
                    .then(
                        function () {
                            callback(null);
                        },
                        function () {
                            callback(1);
                        }
                    );
            },
            function (callback) {
                // 查找有没有接口以要删除的响应作为激活响应，有的话统一删除
                Interface
                    .update(
                        {
                            activeResponse: thisDoc._id
                        },
                        {
                            $unset: {
                                activeResponse: ''
                            }
                        },
                        {
                            // 虽然现在响应只对应一个接口，为未来扩展，所有接口都更新下
                            multi: true
                        }
                    )
                    .exec()
                    .then(
                        function () {
                            callback(null);
                        },
                        function () {
                            callback(1);
                        }
                    );
            },
            function (callback) {
                // 队列中去除要即将删除的文档
                Queue
                    .find({
                        responses: {
                            $in: [thisDoc._id]
                        }
                    })
                    .update({
                        // 剔除这个节点的ref
                        $pull: {
                            responses: thisDoc._id
                        }
                    })
                    .exec()
                    .then(
                        function () {
                            callback(null);
                        },
                        function () {
                            callback(1);
                        }
                    );
            }
        ],
        function (err) {
            err ? next(new Error()) : next();
        }
    );
};
