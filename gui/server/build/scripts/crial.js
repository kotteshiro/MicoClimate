"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Crial = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _log = require("./log.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// jshint esversion: 6

var serialport = require('serialport'); //https://github.com/voodootikigod/node-serialport
var SerialPort = serialport.SerialPort;
var parsers = serialport.parsers;

var Crial = exports.Crial = function () {
    function Crial() {
        var portname = arguments.length <= 0 || arguments[0] === undefined ? "COM3" : arguments[0];
        var baudrate = arguments.length <= 1 || arguments[1] === undefined ? "250000" : arguments[1];

        _classCallCheck(this, Crial);

        this.portname = portname;
        this.baudrate = baudrate;
        this.loger = new _log.Log();

        this.port = new SerialPort(this.portname, {
            baudrate: this.baudrate,
            parser: parsers.readline('\r\n')
        });

        this.port.on('open', this.serialOpenFn.bind(this));
        this.port.on('error', this.serialErrorFn.bind(this));
        this.port.on('data', this.defaultDataRec.bind(this));
        this.cbOnData = function () {};

        /*this.port.on('data', function(data) {
           console.log(data);
         });*/
    }

    _createClass(Crial, [{
        key: "defaultDataRec",
        value: function defaultDataRec(data) {
            var ob = { raw: data, timeStamp: Date.now() };
            //console.log("cbondata",this.cbOnData);
            this.cbOnData(ob);
            this.log(ob);
        }
    }, {
        key: "serialOpenFn",
        value: function serialOpenFn() {
            this.send("delay=1000");
            console.log('Serial port open', this.portname, this.baudrate);
        }
    }, {
        key: "serialErrorFn",
        value: function serialErrorFn(err) {
            console.log('Serial port error:\n', err);
            process.exit();
        }
    }, {
        key: "onDataCb",
        value: function onDataCb(fn) {
            this.cbOnData = fn;
        }
    }, {
        key: "log",
        value: function log(obj) {
            this.loger.push(obj);
        }
    }, {
        key: "getLoger",
        value: function getLoger() {
            return this.loger;
        }
    }, {
        key: "close",
        value: function close(cb) {
            this.port.close(cb);
        }
    }, {
        key: "send",
        value: function send(cmd) {
            this.port.write(cmd);
        }
    }]);

    return Crial;
}();