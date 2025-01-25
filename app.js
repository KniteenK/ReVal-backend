import cors from 'cors';
import express from 'express';

import { configDotenv } from 'dotenv';

configDotenv() ;

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN ,
}));



 
export default app ;