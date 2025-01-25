import cors from 'cors';
import { configDotenv } from 'dotenv';
import express from 'express';
import userRouter from './src/routes/user.route.js';

configDotenv() ;

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN ,
}));
app.use ('/api/v1/user', userRouter) ;


 
export default app ;