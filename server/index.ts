import express, { Express } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import routesUrls from './routes/routes';
import cors, { CorsOptions } from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import https from 'https';
import fs from 'fs';

dotenv.config();

const app: Express = express();
const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 4000;
console.log("port:",PORT)

mongoose
  .connect(process.env.DATABASE_ACCESS || '')
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

const corsOptions: CorsOptions = {
  origin: ['https://your-app-name.com', 'http://localhost:3000'],
  credentials: true,
  allowedHeaders: ['Origin', 'Content-Type', 'Authorization', 'x-csrf-token', 'Accept'],
  exposedHeaders: ['Authorization' ] 
};

if (process.env.NODE_ENV === 'development') {
  const httpsOptions = {
    key: fs.readFileSync('../localhost.key'),
    cert: fs.readFileSync('../localhost.crt'),
  };

  const httpsServer = https.createServer(httpsOptions, app);

  httpsServer.listen(PORT, () => {
    console.log(`Server is running on HTTPS at https://localhost:${PORT}`);
  });
} else {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use('/', routesUrls);
