import express from 'express';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import adminRouter from './routes/admin.route.js';
import songRouter from './routes/song.route.js';
import albumRouter from './routes/album.route.js';
import statsRouter from './routes/stat.route.js';
import playlistRouter from './routes/playlist.route.js';
import connectDB from './lib/db.js';
import {clerkMiddleware} from '@clerk/express';
import fileUpload from 'express-fileupload';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import { createServer } from 'http';
import { initializeSocket } from './lib/socket.js';

dotenv.config();
const app=express();

const httpServer=createServer(app);

initializeSocket(httpServer);

app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, 'tmp'),
    createParentPath: true,
    limits: {
        fileSize: 1024 * 1024 * 10,
    },
}));


const PORT=process.env.PORT || 5000;

app.get('/',(req,res)=>{
    res.send('Music App Backend is up and running!')
});
app.use(clerkMiddleware());
app.use("/api/users",userRouter)
app.use("/api/auth",authRouter)
app.use("/api/admin",adminRouter)
app.use("/api/songs",songRouter)
app.use("/api/playlists",playlistRouter)
app.use("/api/albums",albumRouter)
app.use("/api/stats",statsRouter)

app.use((err,req,res,next)=>{
    res.status(500).json({message: process.env.NODE_ENV==='production'?'Internal server error':err.message});
});

httpServer.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});