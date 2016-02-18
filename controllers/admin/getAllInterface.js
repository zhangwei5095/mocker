/**
 * @file 获取全部已注册接口的ajax接口
 * @author Franck Chen(chenfan02@baidu.com)
 */

var db = require('../../lib/db');
var Interface = db.model('interface');

module.exports = {
    method: 'post',
    controller: function (req, res) {
        var promise = Interface.list();

        promise.then(
            function (interfaceList) {
                res.json({
                    status: 0,
                    interfaceList: interfaceList
                });
            },
            function () {
                res.json({
                    status: 1
                })
            }
        );
    }
};
