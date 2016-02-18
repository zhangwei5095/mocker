/**
 * @file 主数据库连接文件,注意实例化了新db
 * @author Franck Chen(chenfan02@baidu.com)
 * @date 2015-11-23
 */

// 原生模块
var fs = require('fs');

// 第三方模块
var mongoose = require('mongoose');

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

    dbOption = Object.assign({}, defaultOptions, userOption);
}
catch (e) {
    dbOption = defaultOptions;
}

// 连接mongo DB
var db = mongoose.createConnection();
db.open(dbOption.address, dbOption.dbName, dbOption.port);

module.exports = db;
