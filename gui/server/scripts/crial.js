// jshint esversion: 6

var serialport = require('serialport'); //https://github.com/voodootikigod/node-serialport
var SerialPort = serialport.SerialPort;
var parsers = serialport.parsers;
import {Log} from "./log.js";

export class Crial{
    constructor(portname="COM3",baudrate="250000"){
        this.portname=portname;
        this.baudrate=baudrate;
        this.loger=new Log();

        this.port = new SerialPort(this.portname, {
          baudrate: this.baudrate,
          parser: parsers.readline('\r\n')
        });

        this.port.on('open', this.serialOpenFn.bind(this));
        this.port.on('error', this.serialErrorFn.bind(this));
        this.port.on('data', this.defaultDataRec.bind(this));
        this.cbOnData = function(){};
        
       /*this.port.on('data', function(data) {
          console.log(data);
        });*/
        
    }
    defaultDataRec(data){
        let ob = {raw:data,timeStamp:Date.now()};
        //console.log("cbondata",this.cbOnData);
        this.cbOnData(ob);
        this.log(ob);
    }
    serialOpenFn() {
        this.send("delay=1000")
        console.log('Serial port open',this.portname,this.baudrate);
    }
    serialErrorFn(err){
        console.log('Serial port error:\n',err);
        process.exit();
    }
    onDataCb(fn){
        this.cbOnData = fn;
    }
    log(obj){
        this.loger.push(obj);
    }
    getLoger(){
       return this.loger;
    }
    close(cb){
        this.port.close(cb);
    }
    send(cmd){
        this.port.write(cmd);
    }
}
