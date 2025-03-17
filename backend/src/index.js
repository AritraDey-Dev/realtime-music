import express from 'express';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';

const app=express();


dotenv.config();
const PORT=process.env.PORT || 5000;

app.get('/',(req,res)=>{
    res.send('Hello World!');
});

app.use("/api/users",userRouter)

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});