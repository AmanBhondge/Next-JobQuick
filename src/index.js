import http from 'http';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { PORT } from './config/config.js';

import connectToDatabase from './database/mongodb.js'
import errorMiddleware from './middlewares/error.middleware.js'

import authRouter from './routes/auth.route.js';
import seekerRouter from './routes/seeker.route.js';
import hosterRouter from './routes/hoster.route.js';
import categoriesRouter from './routes/catogries.route.js';


const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/seeker', seekerRouter);
app.use('/api/v1/hoster', hosterRouter);
app.use('/api/v1/categories',categoriesRouter);


app.use(errorMiddleware);

server.listen(PORT, async () => {
  console.log(` API is running on http://localhost:${PORT}`);

  await connectToDatabase();
});

export default app; 