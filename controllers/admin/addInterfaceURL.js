/**
 * @file 新添接口接口
 * @author Franck Chen(chenfan02@baidu.com)
 */

var interfaceModel = require('../../model/interfaceModel');

module.exports = {
    method: 'post',
    controller: function (req, res) {
        // post数据，由body parser自动解析
        var postData = req.body;
        var newInterfaceURL = postData.url;

        // 调用model层接口，注册新接口
        var promise = interfaceModel.add(newInterfaceURL);

        promise.then(
            function (data) {
                res.json(data);
            },
            function () {
                res.json({
                    status: 1,
                    statusInfo: '错误'
                });
            }
        );
    }
};
