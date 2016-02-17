/**
 * @file json返回文档model
 * @author Franck Chen(chenfan02@baidu.com)
 * @date 2015-11-08
 */

// 第三方依赖
var Promise = require('bluebird');
var mongoose = require('mongoose');

// 连接数据库
var db = require('../lib/db');

// schema
var responseSchema = require('./schemas/response');

// collection名
var collectionName = 'response';

// 注册response
mongoose.model(collectionName, responseSchema);

// model对象
var Response = db.model(collectionName, responseSchema);

/**
 * 生成新的响应实体，并入库
 *
 * @param {string} name 响应的名字
 * @param {string} interfaceId 响应所属的interface的id
 * @param {string} type 响应的类型,如‘JSON’,‘HTML’等等
 * @param {*} data 响应内容
 * @return {Promise} Promise对象
 */
exports.add = function (name, interfaceId, type, data) {
    switch (type) {
        case 'JSON':
            // JSON数据需要解析后再保存
            data = JSON.parse(data);
            break;
    }

    return new Promise(function (resolve, reject) {
        var doc = {
            // db中name是required, 必须有，且不能是空字符串
            name: name,
            // 记录下这个响应属于哪个接口
            belongTo: interfaceId,
            type: type,
            data: data
        };

        // 创建一个新的响应document并保存
        var newEntity = new Response(doc);
        newEntity.save(function (error, newResponseData) {
            // 新的响应保存无误
            !error ? resolve(newResponseData) : reject();
        });
    });
};

/**
 * 根据响应id获取响应的相关数据
 *
 * @param {string} responseId 响应的id(每个响应、每个接口都有自己的id)
 * @param {Object} options 选项
 * @return {Promise}
 */
exports.getById = function (responseId, options) {
    var defaultOptions = {
        populateInterface: false
    };

    options = Object.assign({}, defaultOptions, options);

    return new Promise(function (resolve, reject) {
        // 根据mongodb的id来查找数据
        Response
            .findById(responseId)
            .select('')
            .lean()
            .exec(function (err, doc) {
                if (err || !doc) {
                    reject();
                    return;
                }

                // 根据选项确定是否populate参考的interface文档
                if (options.populateInterface) {
                    doc.populate(
                        {
                            path: 'belongTo',
                            select: 'url'
                        },
                        function (err) {
                            err ? reject () : resolve(doc);
                        }
                    );
                }
                else {
                    resolve(doc);
                }
            });
    });
};

/**
 * 根据id定位响应，完成数据入库更新
 *
 * @param {string} responseId 响应id
 * @param {Object} responseData 响应数据
 * @param {string} responseData.name 新增响应的名称
 * @param {*} responseData.data 新增的响应主体
 * @return {Promise} Promise对象
 */
exports.updateById = function (responseId, responseData) {
    return new Promise(function (resolve, reject) {
        switch (responseData.responseType.toUpperCase()) {
            case 'JSON':
                responseData.data = JSON.parse(responseData.data);
                break;
            case 'HTML':
                break;
            default:
                reject();
        }

        Response.findByIdAndUpdate(
            responseId,
            responseData,
            function (err, data) {
                var doc = data.toObject();
                !err ? resolve(doc) : reject();
            }
        );
    });
};

/**
 * 根据id删除指定的响应
 *
 * @param {string} responseId 响应id
 * @return {Promise} Promise对象
 */
exports.deleteById = function (responseId) {
    return new Promise(function (resolve, reject) {
        Response
            .findById(responseId, function (err, doc) {
                // 无误且查询到了document
                if (!err && !!doc) {
                    // 删除这个响应的document，特别注意不要直接调用model层的remove删除文档，否则无法触发middleware
                    doc.remove(function (err) {
                        !err ? resolve() : reject();
                    });
                }
                else {
                    reject();
                }
            });
    });
};
