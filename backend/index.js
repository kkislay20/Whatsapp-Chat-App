import express from "express"
import http from "http"
import { Server } from "socket.io";
import dotenv from "dotenv"
import cors from "cors";
import msgRouter from './routes/msgs.route.js';
import connectToMongoDB from "./db/connectToMongoDB.js";
import { addMsgToConversation } from "./controllers/messages.controller.js";


dotenv.config();
const PORT = process.env.PORT || 5000;
console.log("Port is " + PORT);

const app = express();
app.use(express.json());
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
   cors: {
      allowedHeaders: ["*"],
      origin: "*"
   }
});


// user - socket mappings

const userSocketMap = {};

io.on('connection', (socket) => {
   console.log('Client connected');
   const username = socket.handshake.query.username;
   console.log("A new user - " + username + " connected!");
   userSocketMap[username] = socket;

   socket.on('chat msg', (msg) => {
      const { sender, receiver, text } = msg;

      const receiverSocket = userSocketMap[receiver];
      if (receiverSocket) {
         receiverSocket.emit('chat msg', msg);
      } else {
         // user is offline
      }

      addMsgToConversation([sender, receiver], {
         text,
         sender,
         receiver
      }
      );

   });
});

app.use('/msgs', msgRouter);

app.get('/', (req, res) => {
   res.send("Welcome to HHLD Chat App!");
});

server.listen(PORT, (req, res) => {
   connectToMongoDB();
   console.log(`Backend Server is running at ${PORT}`);
})
