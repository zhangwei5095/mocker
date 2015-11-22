/**
 * @file mock平台返回数据schema
 * @author Franck Chen(chenfan02@baidu.com)
 * @date 2015-11-08
 */

// 依赖
var mongoose = require('mongoose');

var response = new mongoose.Schema({
    /**
     * 响应名
     */
    name: {
        type: String,
        required: true,
        index: true
    },
    /**
     * 接口返回数据的类型
     */
    type: {
        type: String,
        default: 'JSON'
    },
    /**
     * 响应内容,因为是JSON，所以是字符串
     */
    data: {
        type: mongoose.Schema.Types.Mixed
    },
    /**
     * 响应数据的评论
     */
    description: {
        type: String,
        default: ''
    },
    /**
     * 模板
     */
    template: {
        type: String
    },
    /**
     * JSON各字段的评论
     */
    comment: {
        type: Object
    },
    /**
     * 响应最后的更新时间
     */
    updateTime: {
        type: Date,
        default: Date.now
    }
});

/**
 * 删除文档middleware,主要用途是删除interface中对于该接口的所有引用
 * TODO 位置、结构优化
 */
response.pre('remove', function (next) {
    var InterfaceModel = this.model('interface');
    // 正在准备删除的document
    var thisDoc = this.toObject();

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
                }
            },
            {
                // 虽然现在响应只对应一个接口，为未来扩展，所有接口都更新下
                multi: true
            }
        )
        .exec(
            function (err) {
                if (!err) {
                    next();
                }
                else {
                    next(new Error());
                }
            }
        );
});

// 注册response
mongoose.model('responses', response);

module.exports = response;
