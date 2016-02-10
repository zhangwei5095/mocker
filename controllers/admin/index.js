/**
 * @file 后端管理入口
 * @author Franck Chen(chenfan02@baidu.com)
 */

var interfaceModel = require('../../model/interfaceModel');

module.exports = {
    method: 'get',
    controller: function (req, res, next) {
        var promise = interfaceModel.getInterfaceList();

        promise.then(
            function (interfaceList) {
                res.render('interfaceList', {
                    title: '注册接口总览',
                    // 首屏需要的数据,尽量减少一个AJAX请求
                    initialData: JSON.stringify({
                        interfaceList: interfaceList,
                        // mock平台的地址+端口
                        hostURL: req.get('host')
                    })
                });
            },
            next
        );
    }
};
