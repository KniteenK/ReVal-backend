import bodyParser from 'body-parser';
import cors from 'cors';
import { config as configDotenv } from 'dotenv';
import express from 'express';
import userRouter from './src/routes/user.route.js';

configDotenv();

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
}));

// Middleware to parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Middleware to parse application/json
app.use(express.json());

app.use('/api/v1/user', userRouter);

import postRouter from './src/routes/post.route.js';
app.use('/api/v1/post', postRouter);

export default app;
