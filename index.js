import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import 'dotenv/config';
import authRouter from './Routers/authRouter.js'


const app =  express()
const PORT = 3000

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/api/auth',authRouter);

mongoose.connect(process.env.MONGODB_URI).then(()=>{
    console.log("Database Connected !")
}).catch((err)=>{
    console.log(err)
});

app.get('/',(req,res)=>{
    res.json({message : "Hello from server"})
});


app.listen(PORT,()=>console.log(`Listening at ${PORT}.....`));