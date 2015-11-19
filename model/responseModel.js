/**
 * @file json返回文档model
 * @author Franck Chen(chenfan02@baidu.com)
 * @date 2015-11-08
 */

// mongoose
var mongoose = require('mongoose');

// 第三方依赖
var _ = require('lodash');
var Q = require('q');

// TODO 这么搞对吗？待探讨
var db = mongoose.createConnection('mongodb://127.0.0.1:27017/db');

// schema
var responseSchema = require('./schemas/response');

// collection名,TODO 走可配置路线
var collectionName = 'response';

// model对象
var ResponseModel = db.model(collectionName, responseSchema);

/**
 * 生成新的响应实体，并入库
 *
 * @param {string} name 响应的名字
 * @param {*} data 响应内容
 * @return {Promise} Promise对象
 */
exports.createNewResponseEntity = function (name, data) {
    // promise
    var deferred = Q.defer();
    var promise = deferred.promise;

    var doc = {
        // db中name是required, 必须有，且不能是空字符串
        name: 'cf',
        data: JSON.parse(data)
    };

    // 创建一个新的响应document并保存
    var newEntity = new ResponseModel(doc);
    newEntity.save(function(error, doc) {
        if (!error) {
            deferred.resolve({
                doc: doc
            });
        }
        else {
            deferred.reject();
        }
    });

    return promise;
};

exports.getResponseDataById = function (id) {
    // promise
    var deferred = Q.defer();
    var promise = deferred.promise;

    // 根据mongodb的id来查找数据
    ResponseModel.findById(id)
        .select('')
        .lean()
        .exec(function (err, doc) {
            if (!err) {
                deferred.resolve({
                    status: 0,
                    response: doc
                });
            }
            else {
                deferred.reject({
                    status: 1
                });
            }
        });

    return promise;
};
