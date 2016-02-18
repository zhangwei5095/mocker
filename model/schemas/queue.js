/**
 * @file mock平台响应队列schema
 * @author Franck Chen(chenfan02@baidu.com)
 */

// 依赖
var mongoose = require('mongoose');

var queueSchema = new mongoose.Schema({
    /**
     * 响应的类型 -- 队列
     */
    type: {
        type: String,
        default: 'QUEUE'
    },
    /**
     * 队列的名称
     */
    name: {
        type: String
    },
    /**
     * 队列中的响应
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
     * 队列游标
     */
    position: {
        type: Number,
        default: 0
    }
});

module.exports = queueSchema;