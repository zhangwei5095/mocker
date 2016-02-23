/**
 * @file 队列删除前中间件
 * @author Franck Chen(chenfan02@baidu.com)
 */

module.exports = function (next) {
    var Interface = this.model('interface');
    // 正在准备删除的document
    var thisDoc = this.toObject();

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
                next();
            },
            function () {
                next(new Error());
            }
        );
};
