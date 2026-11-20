import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import { config } from './config.js';
import apiRouter from './routes/api.js';
import { marketDataService } from './services/marketDataService.js';
import { financialNewsEngine } from './services/newsService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.join(__dirname, '../client/dist');

const app = express();
const server = http.createServer(app);

// Initialize WebSocket Server
const wss = new WebSocketServer({ server, path: '/ws' });

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// API Routes
app.use('/api', apiRouter);

// Health probe
app.get('/health', (req, res) => {
  res.json({
    status: 'OPERATIONAL',
    service: 'PACIFIC CAPITAL NEWS API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Serve frontend static assets in production if client/dist exists
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/ws')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// WebSocket Connection handling
wss.on('connection', (ws, req) => {
  marketDataService.addSubscriber(ws);

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      if (data.type === 'PING') {
        ws.send(JSON.stringify({ type: 'PONG', timestamp: new Date().toISOString() }));
      }
    } catch (e) {
      // ignore
    }
  });

  ws.on('close', () => {
    marketDataService.removeSubscriber(ws);
  });
});

// Boot services
server.listen(config.port, () => {
  console.log(`[PACIFIC CAPITAL NEWS] Institutional Server listening on port ${config.port}`);
  
  // Start Market Data polling loop
  marketDataService.startFeed();

  // Start News ingestion loop
  if (config.enableRssIngestion) {
    financialNewsEngine.startIngestion();
  }
});

