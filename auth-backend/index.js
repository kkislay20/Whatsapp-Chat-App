import express from "express"
import http from "http"
import dotenv from "dotenv"
import connectToMongoDB from "./db/connectToMongoDB.js"
import authRouter from './routes/auth.route.js'
import usersRouter from './routes/users.route.js'
import cors from 'cors'
import cookieParser from "cookie-parser"


dotenv.config();
const PORT = process.env.PORT || 5000;
console.log("Port is " + PORT);


const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: "http://localhost:3000"
}));

app.use('/auth', authRouter);
app.use('/users', usersRouter);

app.get('/', (req, res) => {
   res.send("Welcome to HHLD Chat Auth Microservice!");
});

app.listen(PORT, (req, res) => {
    connectToMongoDB();
    console.log(`Server is running at ${PORT}`);
})
 