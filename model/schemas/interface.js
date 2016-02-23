/**
 * @file mock平台接口schema
 * @author Franck Chen(chenfan02@baidu.com)
 * @date 2015-11-08
 */

// 依赖
var mongoose = require('mongoose');

var interfacePreRemove = require('../middlewares/interfacePreRemove');

var interfaceSchema = new mongoose.Schema({
    /**
     * 接口URL地址, 索引
     */
    url: {
        type: String,
        required: true,
        index: true
    },
    /**
     * 是否启用
     */
    enable: {
        type: Boolean,
        default: true
    },
    /**
     * 使用这个接口的用户，内嵌doc未来扩展
     */
    user: {},
    /**
     * 响应集合
     */
    responses: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'response'
            }
        ],
        default: []
    },
    /**
     * 该接口下注册的队列
     */
    queues: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'queue'
            }
        ],
        default: []
    },
    /**
     * 响应数量，即这个接口注册了多少个响应
     */
    responseCount: {
        type: Number,
        default: 0
    },
    /**
     * 接口创建时间
     */
    createTime: {
        type: Date,
        default: Date.now
    },
    /**
     * 最后更新时间
     */
    updateTime: {
        type: Date,
        default: Date.now
    },
    /**
     * 当前接口激活的响应的模式，目前是扩充字段
     */
    mode: {
        type: String,
        default: 'NORMAL'
    },
    /**
     * 当前激活的响应
     */
    activeResponse: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'response'
    },
    /**
     * 当前激活的响应的类型
     */
    activeResponseType: {
        type: String,
        default: ''
    }
});

/**
 * 加载中间件
 */
interfaceSchema.pre('remove', interfacePreRemove);

module.exports = interfaceSchema;
