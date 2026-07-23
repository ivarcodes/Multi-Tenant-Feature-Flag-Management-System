import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db';
import { config } from './config';

const app = express();

app.use(cors({ origin: config.allowedOrigins, credentials: true }));
app.use(express.json());

app.get('/api/v1/health', (_req, res) => {
  res.json({ success: true, data: { status: 'running' } });
});

async function start() {
  await connectDB();
  app.listen(config.port, () => {
    console.log(`Backend running on http://localhost:${config.port}/api/v1`);
  });
}

start();
