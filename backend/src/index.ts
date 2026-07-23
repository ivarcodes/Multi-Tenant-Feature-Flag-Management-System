import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import { connectDB } from './config/db';
import { config } from './config';
import { requestId } from './middleware/requestId';
import { authLimiter, apiLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth';
import organizationRoutes from './routes/organizations';
import featureFlagRoutes from './routes/featureFlags';

const app = express();

app.use(cors({ origin: config.allowedOrigins, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(requestId);

morgan.token('id', (req) => (req as any).id);
app.use(morgan(':method :url :status :id - :response-time ms'));

app.get('/api/v1/health', (_req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  res.json({
    success: true,
    data: {
      status: 'running',
      database: dbStatus[dbState] || 'unknown',
      uptime: process.uptime(),
    },
  });
});

app.use('/api/v1/auth', authLimiter, authRoutes);
app.use('/api/v1/organizations', apiLimiter, organizationRoutes);
app.use('/api/v1/feature-flags', apiLimiter, featureFlagRoutes);

app.use(errorHandler);

async function start() {
  await connectDB();
  app.listen(config.port, () => {
    console.log(`Backend running on http://localhost:${config.port}/api/v1`);
  });
}

start();
