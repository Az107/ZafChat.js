import { Socket } from 'dgram';
import * as Net from 'net'
import { rawListeners } from 'process';
import * as ReadLine from 'readline'


const readline = ReadLine.createInterface({
    input: process.stdin,
    output: process.stdout
});

let sockets : Net.Socket[] = [];
let clients : string[] = [];

const Server = new Net.Server();
Server.listen(80);
Server.on("connection",(socket) =>{
    console.log(socket.remoteAddress);
    socket.write("Hello to ZAFchat\n");
    socket.write("username> ");
    let username : string;

    socket.on('data',(data)=>{
        if (username){
            writeAll(username + ": " + data.toString().trimEnd(),socket);
            socket.write("> ")
        }else{
            username = Login(socket,data.toString().trimEnd());
        }
    });

    socket.on('close', (error)=>{
        const index = sockets.indexOf(socket, 0);
        if (index > -1) {
            sockets.splice(index, 1);
        }
        writeAll("--[" + username + " leaved the session]--");
    });


})


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

