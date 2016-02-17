/**
 * @file 接口删除前的中间件
 * @author Franck Chen(chenfan02@baidu.com)
 */

var Promise = require('bluebird');

module.exports = function (next) {
    var Response = this.model('response');
    // 正在准备删除的document
    var thisDoc = this;

    var promise = new Promise(function (resolve, reject) {
        thisDoc
            .populate('responses', function (err, doc) {
                // 出错处理
                if (err || !doc) {
                    reject();
                    return;
                }

                doc = doc.toObject();

                // 这个接口下所有的响应
                var responses = doc.responses;
                var resIdColl = [];

                var i = 0;
                var len = 0;
                for (i = 0, len = responses.length; i < len; i++) {
                    // 提取出这个接口下的所有响应的id，作为后面查询语句的依据
                    resIdColl.push(responses._id);
                }

                // 有可能这个接口下面没有响应，所以要节省点性能
                if (resIdColl.length > 0) {
                    // 注意这个删除不会触发中间件
                    Response
                        .remove(
                            {
                                _id: {
                                    $in: resIdColl
                                }
                            },
                            function (err) {
                                if (err) {
                                    reject();
                                    return;
                                }

                                resolve();
                            }
                        );
                }
                else {
                    resolve();
                }
            });
    });

    promise.then(
        next,
        function () {
            next(new Error());
        }
    );
};
