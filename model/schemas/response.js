/**
 * @file mock平台返回数据schema
 * @author Franck Chen(chenfan02@baidu.com)
 * @date 2015-11-08
 */

// 依赖
var mongoose = require('mongoose');

var responsePreRemove = require('../middlewares/responsePreRemove');

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
     * 接口所属于哪个接口
     */
    belongTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'interface'
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
     * JSON各字段的评论
     */
    comment: {
        type: mongoose.Schema.Types.Mixed
    },
    /**
     * 响应最后的更新时间
     */
    updateTime: {
        type: Date,
        default: Date.now
    },
    /**
     * 模板
     */
    template: {
        type: String
    }
});

/**
 * 删除文档middleware,主要用途是删除interface中对于该接口的所有引用
 */
response.pre('remove', responsePreRemove);

// 注册response
mongoose.model('responses', response);

module.exports = response;
