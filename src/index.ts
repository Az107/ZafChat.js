import * as Net from 'net'
import * as ReadLine from 'readline'
import { Server as wServer, Socket as wSocket} from "socket.io";

const readline = ReadLine.createInterface({
    input: process.stdin,
    output: process.stdout
});

let sockets : Net.Socket[] = [];
let clients : string[] = [];

const Server = new Net.Server();
const io = new wServer();
io.listen(3000,{
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["Access-Control-Allow-Origin"]
    }
  });
Server.listen(80);
Server.on("connection",(socket) =>{
    console.log(socket.remoteAddress);
    socket.write("Hello to ZAFchat\n");
    socket.write("username> ");
    let username : string;

    socket.on('data',(data)=>{
        if (username){
            writeAll(username + ": " + data.toString().trimEnd(),socket);
            io.sockets.emit("msg",username + ": " + data.toString().trimEnd());
            socket.write("> ")
        }else{
            username = Login(socket,data.toString().trimEnd());
        }
    });

    socket.on('error', error =>{
        console.log("me regala un bocadisho?"); 
    });


    socket.on('close', (error)=>{
        const index = sockets.indexOf(socket, 0);
        if (index > -1) {
            sockets.splice(index, 1);
        }
        writeAll("--[" + username + " leaved the session]--");
    });


});

Server.on('error', error =>{
    console.log("batileche y bocadillos para todos");
});


io.on('connection', (socket : wSocket) =>{
    console.log("connected from web");
    socket.on("msg",(msg) =>{
        writeAll(msg);
        io.sockets.emit("msg",msg);
    })

});

function Login(socket : Net.Socket,username : string){
    if (!(username in clients)){
        socket.write("logged as " + username + "\n");
        writeAll("--[" + username + " joined the session]--",socket);
        sockets.push(socket);
        clients.push(username);
        return username;
    }else{
        return  "";
    }
}

function writeAll(text : String, exception? : Net.Socket){
    sockets.forEach(socket =>{
        if (socket !== exception)
            socket.write(text + "\n")
    });
}

