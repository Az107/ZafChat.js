"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Net = __importStar(require("net"));
const ReadLine = __importStar(require("readline"));
const socket_io_1 = require("socket.io");
const readline = ReadLine.createInterface({
    input: process.stdin,
    output: process.stdout
});
let sockets = [];
let clients = [];
const Server = new Net.Server();
const io = new socket_io_1.Server();
io.listen(3000, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["Access-Control-Allow-Origin"]
    }
});
Server.listen(80);
Server.on("connection", (socket) => {
    console.log(socket.remoteAddress);
    socket.write("Hello to ZAFchat\n");
    socket.write("username> ");
    let username;
    socket.on('data', (data) => {
        if (username) {
            writeAll(username + ": " + data.toString().trimEnd(), socket);
            io.sockets.emit("msg", username + ": " + data.toString().trimEnd());
            socket.write("> ");
        }
        else {
            username = Login(socket, data.toString().trimEnd());
        }
    });
    socket.on('error', error => {
        console.log("me regala un bocadisho?");
    });
    socket.on('close', (error) => {
        const index = sockets.indexOf(socket, 0);
        if (index > -1) {
            sockets.splice(index, 1);
        }
        writeAll("--[" + username + " leaved the session]--");
    });
});
Server.on('error', error => {
    console.log("batileche y bocadillos para todos");
});
io.on('connection', (socket) => {
    console.log("connected from web");
    socket.on("msg", (msg) => {
        writeAll(msg);
        io.sockets.emit("msg", msg);
    });
});
function Login(socket, username) {
    if (!(username in clients)) {
        socket.write("logged as " + username + "\n");
        writeAll("--[" + username + " joined the session]--", socket);
        sockets.push(socket);
        clients.push(username);
        return username;
    }
    else {
        return "";
    }
}
function writeAll(text, exception) {
    sockets.forEach(socket => {
        if (socket !== exception)
            socket.write(text + "\n");
    });
}
