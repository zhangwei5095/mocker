/**
 * @file 修改接口激活响应接口
 * @author Franck Chen(chenfan02@baidu.com)
 */

// 第三方
var mongoose = require('mongoose');

// 应用模块
var db = require('../../lib/db');

var Interface = db.model('interface');

var ObjectId = mongoose.Types.ObjectId;

module.exports = {
    method: 'post',
    controller: function (req, res, next) {
        // post数据
        var postData = req.body;

        var interfaceId = postData.interfaceId;
        var activeResponseId = postData.activeResponseId;
        var activeResponseType = postData.activeResponseType;

        // 简单校验
        if (!ObjectId.isValid(interfaceId)) {
            next({status: 1});
            return;
        }

        var operation;
        // responseId为空，操作行为是取消激活
        if (activeResponseId === '') {
            operation = {
                // 删除掉activeResponse字段，成功后接口没有处于激活状态的响应
                $unset: {
                    activeResponse: '',
                    activeResponseType: ''
                }
            };
        }
        else if (ObjectId.isValid(activeResponseId)) {
            operation = {
                // 注意id的类型
                activeResponse: new ObjectId(activeResponseId),
                activeResponseType: activeResponseType
            };
        }
        else {
            // 参数无效的情况
            next({status: 1});
            return;
        }

        // 查找对应id的接口，更新数据
        Interface
            .findByIdAndUpdate(
                interfaceId,
                operation
            )
            .exec()
            .then(
                function () {
                    res.json({
                        status: 0
                    });
                },
                function () {
                    res.json({
                        status: 1
                    });
                }
            );
    }
};
