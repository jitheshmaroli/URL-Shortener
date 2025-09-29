import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectMongoDB } from './config/mongoConnection';
import authRoutes from './routes/authRoutes';
import { env } from './config/env';
import { errorMiddleware } from './middlewares/errorMiddleware';
import logger from './utils/logger';

const app = express();
const MONGODB_URI = env.MONGODB_URI;
const PORT = env.PORT;

app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);

app.use(errorMiddleware);

const serverConnect = async () => {
  try {
    await connectMongoDB(MONGODB_URI);
    app.listen(PORT, '0.0.0.0', () => {
      logger.info(
        `Server running on http://localhost:${PORT} env: ${env.NODE_ENV}`
      );
    });
  } catch (error) {
    if (error instanceof Error) {
      logger.error('MongoDB connection error', { error: error.message });
    } else {
      logger.error('MongoDB connection error', { error: String(error) });
    }
  }
};

serverConnect();
