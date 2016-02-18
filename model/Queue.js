/**
 * @file 队列model
 * @author Franck Chen(chenfan02@baidu.com)
 */

// 第三方依赖
var Promise = require('bluebird');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

mongoose.Promise = Promise;

// 数据库实例
var db = require('../lib/db');

// collection名
var collectionName = 'queue';

// schema
var queueSchema = require('./schemas/queue');

// model对象
var Queue = db.model(collectionName, queueSchema);
