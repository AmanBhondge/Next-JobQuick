import http from 'http';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { PORT } from './config/config.js';

import connectToDatabase from './database/mongodb.js'
import errorMiddleware from './middlewares/error.middleware.js'

import userRouter from './routes/user.route.js';


const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  "http://localhost:3000",
  "https://job-quick-next.vercel.app/"
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/v1/users', userRouter);


app.use(errorMiddleware);

server.listen(PORT, async () => {
  console.log(` API is running on http://localhost:${PORT}`);

  await connectToDatabase();
});

export default app; 