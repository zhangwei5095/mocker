/**
 * @file 响应document删除前的中间件
 * @author Franck Chen(chenfan02@baidu.com)
 */

var Promise = require('bluebird');

module.exports = function (next) {
    var InterfaceModel = this.model('interface');
    // 正在准备删除的document
    var thisDoc = this.toObject();

    var promise = new Promise(function (resolve, reject) {
        InterfaceModel
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
            .exec(
                function (err) {
                    !err ? resolve() : reject();
                }
            );
    });

    promise.then(
        function () {
            // 查找有没有接口以要删除的响应作为激活响应，有的话统一删除
            InterfaceModel
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
                .exec(function (err) {
                    !err ? next() : next(new Error());
                });
        },
        function () {
            next(new Error());
        }
    );
};
