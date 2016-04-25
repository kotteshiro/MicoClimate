'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Datastore = require('nedb') //https://github.com/louischatriot/nedb
,
    db = new Datastore({ filename: 'logdb', autoload: true });

var Log = exports.Log = function () {
    function Log() {
        _classCallCheck(this, Log);

        this.dbid = "";
        db.insert({ doctype: "log", date: Date.now(), data: [] }, function (err, newDocs) {
            this.dbid = newDocs._id;
            // Two documents were inserted in the database
            // newDocs is an array with these documents, augmented with their _id
        }.bind(this));
    }

    _createClass(Log, [{
        key: 'find',
        value: function find() {
            db.find({ _id: this.dbid }, function (err, docs) {
                console.log(docs);
            });
        }
    }, {
        key: 'push',
        value: function push(d) {
            db.find({ _id: this.dbid }, function (err, docs) {
                if (!err) {
                    db.update({ _id: this.dbid }, { $push: { data: d } }, {}, function () {});
                    //console.log("pushing new log:",d);
                } else {
                        console.error(err);
                    }
            }.bind(this));
        }
    }, {
        key: 'getAllLog',
        value: function getAllLog(cb) {
            console.log("busca _id:", this.dbid);
            db.find({ _id: this.dbid }, function (err, docs) {
                if (!err) {
                    cb(docs);
                } else {
                    console.error(err);
                }
            });
        }
    }]);

    return Log;
}();