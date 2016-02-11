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

// 连接数据库
var db = require('../lib/dbConnection');

// schema
var interfaceSchema = require('./schemas/interface');

// collection名
var collectionName = 'interface';
var InterfaceModel = db.model(collectionName, interfaceSchema);

var responseModel = require('./responseModel');

/**
 * 获取接口列表ajax接口
 *
 * @return {Promise} promise对象
 */
exports.getInterfaceList = function () {
    return new Promise(function (resolve, reject) {
        // 查看全部接口
        InterfaceModel
            .find({})
            .select('activeResponse responses url')
            .populate({
                path: 'activeResponse',
                // populate目前激活的响应，需要的字段只有name
                select: 'name'
            })
            .lean()
            .exec(function (err, interfaceList) {
                // 成功返回数据
                (!err) ? resolve(interfaceList) : reject(err);
            });
    });
};

/**
 * 注册新接口
 *
 * @param {string} newInterfaceUrl 新添接口的URL
 * @param {string} type 新添接口的类型，如JSON,VM,Smarty...
 * @return {Promise} promise对象
 */
exports.registerNewInterface = function (newInterfaceUrl, type) {
    // 目前忽略查询字符串部分
    var newInterfaceURL = URL.parse(newInterfaceUrl).pathname;

    return new Promise(function (resolve, reject) {
        // 根据url查找
        InterfaceModel.findOne(
            {
                // 目前只支持常规路径，不支持查询字符串
                url: newInterfaceURL
            },
            '',
            function (err, url) {
                // 不允许注册同名的action，所以如果有记录则需要提示错误
                if (url) {
                    reject({
                        statusInfo: '接口地址已存在'
                    });
                }
                else {
                    var doc = {
                        url: newInterfaceURL,
                        type: type
                    };

                    var mongooseEntity = new InterfaceModel(doc);
                    mongooseEntity.save(function (error) {
                        if (!error) {
                            resolve();
                        }
                        else {
                            reject({
                                statusInfo: '保存失败'
                            });
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
 * @param {*} data 相应数据，目前只是json字符串
 * @return {Promise} promise对象
 */
exports.addNewJSONRes = function (interfaceId, name, data) {
    // 创建一个新的响应并入库
    var promise = responseModel.createNewResponseEntity(name, data);

    return new Promise(function (resolve, reject) {
        promise.then(
            function (newResponseData) {
                InterfaceModel.findOneAndUpdate(
                    {
                        _id: interfaceId
                    },
                    {
                        // 添加新的响应入数组
                        $push: {
                            // doc即新document
                            responses: newResponseData
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
        InterfaceModel.findOne({_id: id})
            .populate('responses')
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
    // 消除掉/mock前缀
    url = url.replace(/^mock\//, '');

    return new Promise(function (resolve, reject) {
        // 根据URL查询接口，取activeResponse ref并populate
        InterfaceModel
            .findOne({url: url})
            .populate('activeResponse')
            .lean()
            .exec(function (err, doc) {
                if (!err) {
                    // 没有doc，即这个url还没有注册成为接口，应该返回404
                    if (!doc) {
                        resolve({
                            status: 1,
                            statusInfo: '当前地址未被注册为接口'
                        });

                        // 避免代码往下走，往下走就报错了
                        return;
                    }

                    // 当前该接口激活的响应，目前只支持JSON
                    var activeResponse = doc.activeResponse;

                    if (activeResponse) {
                        resolve({
                            status: 0,
                            // 响应内容，目前支持JSON，所以这将是个对象
                            response: activeResponse.data
                        });
                    }
                    else {
                        resolve({
                            status: 1,
                            statusInfo: '该接口没有处于激活状态的响应，请尝试激活'
                        });
                    }
                }
                else {
                    // reject一般为系统级错误
                    reject({
                        statusInfo: '查询错误'
                    });
                }
            });
    });
};

/**
 * 更新目标接口的启用响应
 *
 * @param {string} interfaceId 要更新启动响应的接口的id
 * @param {string} responseId 启用的响应的id
 * @return {Promise} Promise对象
 */
exports.setActiveResponse = function (interfaceId, responseId) {
    var operation = {};

    // responseId为空，操作行为是取消激活
    if (responseId === '') {
        operation = {
            // 删除掉activeResponse字段，成功后接口没有处于激活状态的响应
            $unset: {
                activeResponse: ''
            }
        }
    }
    else {
        operation = {
            // 注意id的类型
            activeResponse: new ObjectId(responseId)
        }
    }

    return new Promise(function (resolve, reject) {
        // 查找对应id的接口，更新数据
        InterfaceModel.findByIdAndUpdate(
            interfaceId,
            operation,
            function (err) {
                !err ? resolve() : reject();
            }
        );
    });
};

/**
 * 删除对应id的接口
 *
 * @param {string} interfaceId 要删除的接口的id
 * @return {Promise}
 */
exports.deleteInterfaceById = function (interfaceId) {
    return new Promise(function (resolve, reject) {
        InterfaceModel
            .findById(interfaceId)
            .exec(function (err, doc) {
                // 查询出错
                if (err) {
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
