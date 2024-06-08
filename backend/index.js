import express from "express"
import http from "http"
import { Server } from "socket.io";
import dotenv from "dotenv"

dotenv.config();
const PORT = process.env.PORT || 5000;
console.log("Port is " + PORT);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
   cors: {
       allowedHeaders: ["*"],
       origin: "*"
     }
});


// user - socket mappings


io.on('connection', (socket) => {
   console.log('Client connected');
   const username = socket.handshake.query.username;
   console.log("A new user - " + username + " connected!");

   socket.on('chat msg', (msg) => {
        console.log('Received msg ' + JSON.stringify(msg));
        
        //broadcast to all except sender
        socket.broadcast.emit('chat msg', msg);
        
        //broadcast to all connections including sender
        //io.emit('chat msg', msg);
   });
});

app.get('/', (req, res) => {
   res.send("Welcome to HHLD Chat App!");
});

server.listen(PORT, (req, res) => {
    console.log(`Server is running at ${PORT}`);
})
 