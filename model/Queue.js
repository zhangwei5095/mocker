/**
 * @file 队列model
 * @author Franck Chen(chenfan02@baidu.com)
 */

// 第三方依赖
var Promise = require('bluebird');
var mongoose = require('mongoose');

mongoose.Promise = Promise;

// 数据库实例
var db = require('../lib/db');

// collection名
var collectionName = 'queue';

// schema
var queueSchema = require('./schemas/queue');

// 注册为model对象
db.model(collectionName, queueSchema);
