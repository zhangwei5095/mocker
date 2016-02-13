/**
 * @file 模拟数据路由
 * @author Franck Chen(chenfan02@baidu.com)
 */

// express
var express = require('express');
var router = express.Router();

var mockController = require('../controllers/mock/main');

// 模拟JSON返回的接口
router.use('*', mockController);

module.exports = router;
