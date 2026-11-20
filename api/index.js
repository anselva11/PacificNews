import express from 'express';
import cors from 'cors';
import { config } from '../server/config.js';
import apiRouter from '../server/routes/api.js';
import { marketDataService } from '../server/services/marketDataService.js';
import { financialNewsEngine } from '../server/services/newsService.js';

const app = express();

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// API Routes
app.use('/api', apiRouter);

// Health probe
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OPERATIONAL',
    service: 'PACIFIC CAPITAL NEWS API',
    version: '1.0.0',
    platform: 'vercel-serverless',
    timestamp: new Date().toISOString()
  });
});

// Initialize services on cold start
let initialized = false;
if (!initialized) {
  marketDataService.startFeed();
  if (config.enableRssIngestion) {
    financialNewsEngine.startIngestion();
  }
  initialized = true;
}

export default app;
