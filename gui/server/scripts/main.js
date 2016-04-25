import {Crial} from "./crial.js";
var express = require('express');  
var app = express();  
var server = require('http').Server(app);  
var io = require('socket.io')(server);


var ser = new Crial();
var streaming = false;
ser.onDataCb((data) => {
    if(streaming)
        io.sockets.emit('console.log', data) 
});
//console.log("serial object",ser);


app.use(express.static('public'));

app.get('/hello', function(req, res) {  
  res.status(200).send("Hello World!");
});

io.on('connection', function(socket) {  
  console.log('Alguien se ha conectado con Sockets');
    
  socket.on('command', function(comando) {
      console.log("comando: ", comando);
      comando=comando.split(" ");
      switch(comando[0]){
          case "exit":
            ser.close(k => {
                console.log("serial cerrado"); 
                process.exit();
            });
            break;
          case "getAllLog":
              ser.getLoger().getAllLog(logData => {
                  if(comando[1]!="" && comando[1]=="c"){
                      console.log(logData);
                  }
                  io.sockets.emit('console.log', logData);
              });
              break;
          case "stream":
              if (comando.length<2) return;
              switch(comando[1]){
                case "on":
                    streaming=true;
                    break;
                case "off":
                    streaming= false
                    break;
              }
              break;
          case ">":
              if (comando.length<2) return;
              ser.send(comando[1]);
              break;
          default:
            console.warn("Comando no reconocido",comando);
      }
  });
 //socket.on("",fn)
});


server.listen(8082, function() {  
  console.log("Servidor corriendo en http://localhost:8082");
});