/**
 * @file mongodb连接文件
 * @author Franck Chen(chenfan02@baidu.com)
 * @date 2015-11-23
 */

// 原生模块
var fs = require('fs');

// 第三方模块
var mongoose = require('mongoose');
var _ = require('lodash');

var defaultOptions = {
    address: '127.0.0.1',
    port: 27017,
    dbName: 'db'
};

var dbOption = {};

try {
    // 读取用户db配置
    var userOption = fs.readFileSync('../dbConfig.json');

    userOption = JSON.parse(userOption);

    dbOption = _.extend({}, defaultOptions, userOption);
}
catch (e) {
    dbOption = defaultOptions;
}

var dbLocation = ''
    + 'mongodb://'
    + dbOption.address
    + ':' + dbOption.port
    + '/' + dbOption.dbName;

// 连接mongo DB
module.exports = mongoose.createConnection(dbLocation);
