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
     * 响应延迟
     */
    delay: {
        type: Number,
        default: 0
    },
    /**
     * 响应的HTTP状态码
     */
    httpStatusCode: {
        type: Number,
        default: 200
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
    },
    /**
     * 响应队列
     */
    queue: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'responses'
    },
    /**
     * 响应处于哪种模式,目前只有普通的，未来添加队列模式和redirect模式
     */
    mode: {
        type: 'string',
        default: 'NORMAL'
    }
});

/**
 * 删除文档middleware,主要用途是删除interface中对于该接口的所有引用
 */
response.pre('remove', responsePreRemove);

// 注册response
mongoose.model('responses', response);

module.exports = response;
