/**
 * @file 接口列表model
 * @author Franck Chen(chenfan02@baidu.com)
 * @date 2015-11-08
 */

// mongoose
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

// 第三方依赖
var _ = require('lodash');
var Q = require('q');

// TODO 这么搞对吗？待探讨
var db = mongoose.createConnection('mongodb://127.0.0.1:27017/db');

// schema
var interfaceSchema = require('./schemas/interface');

// collection名
var collectionName = 'interface';
var InterfaceModel = db.model(collectionName, interfaceSchema);

var responseModel = require('./responseModel');

/**
 * 获取站点列表
 *
 * @return {Promise} promise对象
 */
exports.getInterfaceList = function () {
    // promise
    var deferred = Q.defer();
    var promise = deferred.promise;

    // 查看全部接口 TODO 应该查询那些字段需要提炼，提高这里的性能
    InterfaceModel.find(
        {
        },
        '',
        function (err, interfaceList) {
            if (!err) {
                // 成功返回数据
                deferred.resolve({
                    interfaceList: interfaceList
                });
            }
            else {
                deferred.reject(err);
            }
        }
    );

    return promise;
};

/**
 * 注册新接口
 *
 * @param {string} newInterfaceUrl 新添接口的URL
 * @param {string} type 新添接口的类型，如JSON,VM,Smarty...
 * @return {Promise} promise对象
 */
exports.registerNewInterface = function (newInterfaceUrl, type) {
    // promise
    var deferred = Q.defer();
    var promise = deferred.promise;

    // 根据url查找
    InterfaceModel.findOne(
        {
            url: newInterfaceUrl
        },
        '',
        function (err, url) {
            // 不允许注册同名的action，所以如果有记录则需要提示错误
            if (url) {
                deferred.reject({
                    // 非0都是错误
                    status: 1,
                    statusInfo: '接口地址已存在'
                });
            }
            else {
                var doc = {
                    url: newInterfaceUrl,
                    type: type
                };

                var mongooseEntity = new InterfaceModel(doc);
                mongooseEntity.save(function(error) {
                    if (!error) {
                        deferred.resolve({
                            status: 0
                        });
                    }
                    else {
                        deferred.reject({
                            status: 1,
                            statusInfo: '接口创建失败'
                        });
                    }
                });
            }
        }
    );

    return promise;
};

exports.getInterfaceDataById = function (id) {
    // promise
    var deferred = Q.defer();
    var promise = deferred.promise;

    id = new ObjectId(id.toString());

    // 根据mongodb的id来查找数据
    InterfaceModel.findById(id)
        .select('')
        .lean()
        .exec(function (err, doc) {
            if (!err) {
                deferred.resolve({
                    status: 0,
                    data: doc
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

/**
 * 为接口添加新的JSON相应
 *
 * @param {string} interfaceId 接口id
 * @param {string} name 响应的名称
 * @param {*} data 相应数据，目前只是json字符串
 * @return {Promise} promise对象
 */
exports.addNewJSONRes = function (interfaceId, name, data) {
    // promise
    var deferred = Q.defer();
    var newPromise = deferred.promise;

    var promise = responseModel.createNewResponseEntity(name, data);

    promise.then(
        function (data) {
            InterfaceModel.findOneAndUpdate(
                {
                    '_id': interfaceId
                },
                {
                    // 添加新的响应入数组
                    '$push': {
                        // doc即新document
                        responses: data.doc
                    }
                },
                function (err) {
                    // TODO resolve,reject规则统一
                    if (!err) {
                        deferred.resolve({
                            status: 0
                        });
                    }
                    else {
                        deferred.resolve({
                            status: 1
                        });
                    }
                }
            );
        },
        function () {
            deferred.reject({
                status: 1
            });
        }
    );

    return newPromise;
};

/**
 * 根据接口id获取该接口的全部设置响应
 *
 * @param {string} id 接口id
 */
exports.getReposeList = function (id) {
    // promise
    var deferred = Q.defer();
    var promise = deferred.promise;

    // 根据mongodb的id来查找数据
    InterfaceModel.findOne({_id: id})
        .populate('responses')
        .lean()
        .exec(function (err, doc) {
            if (!err) {
                deferred.resolve({
                    status: 0,
                    responses: doc.responses
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

/**
 * 根据URL查询接口数据
 *
 * @param {string} url 请求的url
 * @return {Promise} promise对象
 */
exports.findInterfaceDataByURL = function (url) {
};

exports.getActiveResponse = function (url) {
    // promise
    var deferred = Q.defer();
    var promise = deferred.promise;

    // 根据URL查询接口
    InterfaceModel.findOne({url: url})
        .populate('responses')
        .lean()
        .exec(function (err, doc) {
            if (!err) {
                deferred.resolve({
                    status: 0,
                    response: doc.responses[0]
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
