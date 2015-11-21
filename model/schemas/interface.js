/**
 * @file mock平台接口schema
 * @author Franck Chen(chenfan02@baidu.com)
 * @date 2015-11-08
 */

// 依赖
var mongoose = require('mongoose');

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
        default: false
    },
    /**
     * 使用这个接口的用户，内嵌doc未来扩展
     */
    user: {
    },
    /**
     * 响应集合
     */
    responses: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'responses'
            }
        ],
        default: []
    },
    /**
     * 响应数量，即这个接口注册了多少个响应
     */
    responseSize: {
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
     * 激活的接口的id
     */
    activeResponseId: {
        type: mongoose.Schema.Types.ObjectId
    }
});

module.exports = interfaceSchema;
