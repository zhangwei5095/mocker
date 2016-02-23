/**
 * @file 接口列表model
 * @author Franck Chen(chenfan02@baidu.com)
 * @date 2015-11-08
 */

// node
var URL = require('url');

// mongoose
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

// 第三方依赖
var Promise = require('bluebird');

// 应用模块
var Response = require('./responseModel');
var db = require('../lib/db');

mongoose.Promise = Promise;

// schema
var interfaceSchema = require('./schemas/interface');

/**
 * 获取接口列表，用于渲染列表页
 *
 * @static
 * @return {Promise}
 */
interfaceSchema.statics.list = function () {
    return this
        .find({})
        .select('activeResponse responses url responseCount')
        .populate({
            path: 'activeResponse',
            // populate目前激活的响应，需要的字段只有name
            select: 'name'
        })
        .lean()
        .exec();
};

interfaceSchema.statics.getActiveResponseByURL = function (url) {
    return this
        .findOne({url: url})
        // activeResponse的主要作用是方便populate
        .populate('activeResponse activeResponseType')
        .lean()
        .exec();
};

// collection名
var collectionName = 'interface';
// mongoose注册model
var Interface = db.model(collectionName, interfaceSchema);

/**
 * 注册新接口
 *
 * @param {string} newInterfaceUrl 新添接口的URL
 * @return {Promise} promise对象
 */
exports.add = function (newInterfaceUrl) {
    // 目前忽略查询字符串部分
    var newInterfaceURL = URL.parse(newInterfaceUrl).pathname;

    return new Promise(function (resolve, reject) {
        // 根据url查找
        Interface.findOne(
            {
                // 目前只支持常规路径，不支持查询字符串
                url: newInterfaceURL
            },
            '',
            function (err, url) {
                // 不允许注册同名的action，所以如果有记录则需要提示错误
                if (url) {
                    reject('接口地址已存在');
                }
                else {
                    var doc = {
                        url: newInterfaceURL
                    };

                    // 创建新document
                    var mongooseEntity = new Interface(doc);
                    mongooseEntity.save(function (error) {
                        if (!error) {
                            resolve();
                        }
                        else {
                            reject('');
                        }
                    });
                }
            }
        );
    });
};

/**
 * 为接口添加新的JSON相应
 *
 * @param {string} interfaceId 接口id
 * @param {string} name 响应的名称
 * @param {string} type 响应的类型
 * @param {*} data 相应数据，目前只是json字符串
 * @return {Promise} promise对象
 */
exports.addResponse = function (interfaceId, name, type, data) {
    // 创建一个新的响应并入库
    var promise = Response.add(name, interfaceId, type,data);

    return new Promise(function (resolve, reject) {
        promise.then(
            function (newResponseData) {
                // 创建完新的响应实体后需要更新接口的相关数据
                Interface.findOneAndUpdate(
                    {
                        _id: interfaceId
                    },
                    {
                        // 添加新的响应入数组
                        $push: {
                            // doc即新document
                            responses: newResponseData
                        },
                        // 已注册的响应数量自增1
                        $inc: {
                            responseCount: 1
                        }
                    },
                    function (err) {
                        !err ? resolve(newResponseData) : reject();
                    }
                );
            },
            reject
        );
    });
};

/**
 * 根据接口id获取该接口的全部设置响应
 *
 * @param {string} id 接口id
 * @return {Promise} Promise对象
 */
exports.getResponseList = function (id) {
    return new Promise(function (resolve, reject) {
        // 根据mongodb的id来查找数据
        Interface.findOne({_id: id})
            .select('responses url activeResponse')
            .populate({
                path: 'responses',
                // populate目前激活的响应，需要的字段只有name
                select: 'name type'
            })
            .lean()
            .exec(function (err, doc) {
                if (!err) {
                    resolve({
                        responses: doc.responses || [],
                        // 目前启动的响应的id,如果没有则返回空
                        activeResponseId: doc.activeResponse
                            ? doc.activeResponse
                            : '',
                        interfaceURL: doc.url
                    });
                }
                else {
                    reject();
                }
            });
    });
};

/**
 * 返回指定url的模拟数据
 *
 * @param {string} url 请求的地址
 * @return {*} 响应
 */
exports.getActiveResponse = function (url) {
    return new Promise(function (resolve, reject) {
        // 根据URL查询接口，取activeResponse ref并populate
        Interface
            .findOne({url: url})
            .populate('activeResponse')
            .lean()
            .exec(function (err, doc) {
                if (!err) {
                    // 没有doc，即这个url还没有注册成为接口，应该返回404
                    if (!doc) {
                        reject({
                            status: 2,
                            statusInfo: '当前地址未被注册为接口'
                        });

                        // 避免代码往下走，往下走就报错了
                        return;
                    }

                    // 当前该接口激活的响应，目前只支持JSON
                    var activeResponse = doc.activeResponse;

                    if (activeResponse) {
                        resolve(activeResponse);
                    }
                    else {
                        reject({
                            status: 3,
                            statusInfo: '该接口没有处于激活状态的响应，请尝试激活'
                        });
                    }
                }
                else {
                    // mongoDB查询出错
                    reject({
                        status: 1,
                        statusInfo: '系统错误'
                    });
                }
            });
    });
};

/**
 * 删除对应id的接口
 *
 * @param {string} interfaceId 要删除的接口的id
 * @return {Promise}
 */
exports.deleteById = function (interfaceId) {
    return new Promise(function (resolve, reject) {
        Interface
            .findById(interfaceId)
            .exec(function (err, doc) {
                // 查询出错
                if (err || !doc) {
                    reject();
                    return;
                }

                // 删除接口
                doc.remove(function (err) {
                    !err ? resolve() : reject();
                });
            });
    });
};
