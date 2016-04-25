var Datastore = require('nedb') //https://github.com/louischatriot/nedb
  , db = new Datastore({ filename: 'logdb', autoload: true });

export class Log{
    constructor(){
        this.dbid="";
        db.insert({ doctype: "log", date:Date.now(), data:[]}, function (err, newDocs) {
            this.dbid=newDocs._id;
          // Two documents were inserted in the database
          // newDocs is an array with these documents, augmented with their _id
        }.bind(this));
    }
    find(){
        db.find({_id:this.dbid}, function (err, docs) {
            console.log(docs);
        });
    }
    push(d){
        db.find({_id:this.dbid}, function (err, docs) {
            if(!err){
                db.update({ _id: this.dbid }, { $push: { data: d } }, {}, function () { });
                //console.log("pushing new log:",d);
            }else{
                console.error(err);
            }
        }.bind(this));
        
       
    }
    getAllLog(cb){
        console.log("busca _id:", this.dbid);
         db.find({_id:this.dbid}, function (err, docs) {
            if(!err){
                cb(docs);
            }else{
                console.error(err);
            }
        });
    }
}

