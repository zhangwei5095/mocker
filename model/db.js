// 第三方模块
var mongoose = require('mongoose');
var _ = require('lodash');
var Q = require('q');

var db = mongoose.createConnection('mongodb://127.0.0.1:27017/db');

var ObjectId = (require('mongoose').Types.ObjectId);

var mongooseSchema = new mongoose.Schema({
    url: {
        type: String
    }
});

var collectionName = 'cf';

var URLListModel = db.model(collectionName, mongooseSchema);

module.exports = {
    collectionName: collectionName,
    db: db,
    URLListModel: URLListModel,
    getDataByID: function (id) {
        var deferred = Q.defer();
        var promise = deferred.promise;

        id = new ObjectId(id.toString());

        URLListModel.findById(id, function (err, doc) {
            if (err) return handleError(err);

            deferred.resolve(doc);
        });

        return promise;
    },
    saveJSON: function (id, value) {
        id = new ObjectId(id.toString());

        URLListModel
            .where({
                _id: id
            })
            .update(
                {
                    $set: {
                        url: value
                    }
                },
                function (err, data) {
                    console.log(data);
                }
            );
    }
};
