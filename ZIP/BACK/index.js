import 'dotenv/config';
import express from 'express';
import connectToDB from "./utils/db.js"
import User from './models/user.model.js';
import path from 'path'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import {fileURLToPath} from 'node:url';

import userRouter from './routes/user.route.js'
import templeRouter from './routes/temple.route.js'
import nittiRouter from './routes/nitti.route.js'

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json())
app.use(cookieParser())

app.use("/uploads", express.static(path.join(__dirname, "uploads")))

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use("/users",userRouter)
app.use("/temples",templeRouter)
app.use("/nitti",nittiRouter)

app.listen(5000,()=>{
    console.log("Server started");
    connectToDB()
})