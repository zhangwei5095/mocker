// mongoose
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

// 第三方
var Promise = require('bluebird');

// 引用模块
var interfaceSchema = require('./schemas/interface');

mongoose.Promise = Promise;

var Interface = mongoose.model('interface', interfaceSchema);

Interface.static('indByURL', function (url) {
    return this.findOne({url: url});
});

module.exports = Interface;
