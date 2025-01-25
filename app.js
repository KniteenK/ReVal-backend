import cors from 'cors';
import { configDotenv } from 'dotenv';
import express from 'express';
import userRouter from './src/routes/user.route.js';

configDotenv();

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
}));

// Middleware to parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Middleware to parse application/json
app.use(express.json());


app.use('/api/v1/user', userRouter);

export default app;