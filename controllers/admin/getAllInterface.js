/**
 * @file 获取全部已注册接口的ajax接口
 * @author Franck Chen(chenfan02@baidu.com)
 */

var interfaceModel = require('../../model/interfaceModel');

module.exports = {
    method: 'post',
    controller: function (req, res) {
        var promise = interfaceModel.getInterfaceList();

        promise.then(
            function (interfaceList) {
                res.json({
                    interfaceList: interfaceList
                });
            }
        );
    }
};
