/**
 * @file 队列删除前中间件
 * @author Franck Chen(chenfan02@baidu.com)
 */

var async = require('async');

module.exports = function (next) {
    var Interface = this.model('interface');
    // 正在准备删除的document
    var thisDoc = this.toObject();

    async.waterfall(
        [
            function (callback) {
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
                            callback();
                        },
                        function () {
                            callback(1);
                        }
                    );
            },
            function (callback) {
                // 接口的参考中删除即将要删除的这个队列
                Interface
                    .update(
                        {
                            queues: {
                                $in: [thisDoc._id]
                            }
                        },
                        {
                            $pull: {
                                queues: thisDoc._id
                            }
                        },
                        {
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
            }
        ],
        function (err) {
            err ? next(new Error()) : next();
        }
    );
};
