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
    }
});

// 注册response
mongoose.model('responses', response);

module.exports = response;
