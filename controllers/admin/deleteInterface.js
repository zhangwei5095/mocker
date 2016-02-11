/**
 * @file 删除指定模拟接口的ajax接口
 * @author Franck Chen(chenfan02@baidu.com)
 */

var interfaceModel = require('../../model/interfaceModel');
var Promise = require('bluebird');

module.exports = {
    method: 'post',
    controller: function (req, res) {
        var interfaceId = req.body.interfaceId;

        var promise = new Promise(function (resolve, reject) {
            // 根据id删除接口，所以接口id必须提供
            if (!interfaceId || typeof interfaceId !== 'string') {
                reject();
                return;
            }

            interfaceModel
                .deleteById(interfaceId)
                .then(resolve, reject);
        });

        promise.finally(function () {
            res.json({
                status: promise.isFulfilled() ? 0 : 1
            });
        });
    }
};
