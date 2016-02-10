/**
 * @file json返回文档model
 * @author Franck Chen(chenfan02@baidu.com)
 * @date 2015-11-08
 */

// 第三方依赖
var Promise = require('bluebird');

// 连接数据库
var db = require('../lib/dbConnection');

// schema
var responseSchema = require('./schemas/response');

// collection名,TODO 走可配置路线
var collectionName = 'response';

// model对象
var ResponseModel = db.model(collectionName, responseSchema);

/**
 * 生成新的响应实体，并入库
 *
 * @param {string} responseName 响应的名字
 * @param {*} data 响应内容
 * @return {Promise} Promise对象
 */
exports.createNewResponseEntity = function (responseName, data) {
    return new Promise(function (resolve, reject) {
        var doc = {
            // db中name是required, 必须有，且不能是空字符串
            name: responseName,
            data: JSON.parse(data)
        };

        // 创建一个新的响应document并保存
        var newEntity = new ResponseModel(doc);
        newEntity.save(function(error, newResponseData) {
            // 新的响应保存无误
            !error ? resolve(newResponseData) : reject();
        });
    });
};

/**
 * 根据响应id获取响应的相关数据
 *
 * @param {string} responseId 响应的id(每个响应、每个接口都有自己的id)
 * @return {Promise}
 */
exports.getResponseDataById = function (responseId) {
    return new Promise(function (resolve, reject) {
        // 根据mongodb的id来查找数据
        ResponseModel.findById(responseId)
            .select('')
            .lean()
            .exec(function (err, doc) {
                !err ? resolve(doc) : reject();
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
exports.updateResponseDataById = function (responseId, responseData) {
    return new Promise(function (resolve, reject) {
        // responseData是个序列化过的JSON，需要解析后入库
        responseData.data = JSON.parse(responseData.data);

        ResponseModel.findByIdAndUpdate(
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
 * @returns {Promise} Promise对象
 */
exports.deleteResponseById = function (responseId) {
    return new Promise(function (resolve, reject) {
        ResponseModel
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
