/**
 * @file 队列编辑页接口
 * @author Franck Chen(chenfan02@baidu.com)
 */

var db = require('../../lib/db');
var Interface = db.model('interface');

module.exports = {
    method: 'get',
    controller: function (req, res, next) {
        // 首屏数据
        var initData = {};

        res.render('queueEdit', {
            title:  '响应队列编辑',
            initialData: JSON.stringify(initData)
        });
    }
};
