import express from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { marketDataService } from '../services/marketDataService.js';
import { bloombergService } from '../services/bloombergService.js';
import { financialNewsEngine } from '../services/newsService.js';
import { researchService } from '../services/researchService.js';
import { calendarService } from '../services/calendarService.js';
import { companyService } from '../services/companyService.js';
import { store } from '../data/store.js';

const router = express.Router();

// Middleware: Authenticate Admin JWT token
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Institutional admin token required.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token.' });
  }
}

// ==========================================
// 1. MARKET DATA ENDPOINTS
// ==========================================

router.get('/market/quotes', (req, res) => {
  const { category } = req.query;
  const quotes = category 
    ? marketDataService.getQuotesByCategory(category) 
    : marketDataService.getAllQuotes();

  res.json({
    data: quotes,
    bloombergStatus: bloombergService.getStatus(),
    timestamp: new Date().toISOString()
  });
});

router.get('/market/quote/:ticker', (req, res) => {
  const quote = marketDataService.getQuote(req.params.ticker.toUpperCase());
  if (!quote) {
    return res.status(404).json({ error: 'Instrument not found in registry.' });
  }
  res.json({ data: quote, timestamp: new Date().toISOString() });
});

router.get('/market/history/:ticker', async (req, res) => {
  const { ticker } = req.params;
  const range = req.query.range || '1M';
  const series = await marketDataService.getHistoricalSeries(ticker.toUpperCase(), range);
  res.json({
    ticker: ticker.toUpperCase(),
    range,
    data: series,
    count: series.length
  });
});

router.get('/market/status', (req, res) => {
  const bbStatus = bloombergService.getStatus();
  res.json({
    serverTime: new Date().toISOString(),
    feeds: {
      bloomberg: bbStatus,
      crypto: {
        provider: 'CoinGecko Live API',
        status: 'CONNECTED',
        latencyMs: 142
      },
      equitiesAndForex: {
        provider: 'Global Financial Data Network',
        status: 'CONNECTED',
        latencyMs: 198
      }
    },
    metrics: {
      activeSubscribers: marketDataService.subscribers.size,
      quotesCached: marketDataService.quotes.size
    }
  });
});

// ==========================================
// 2. FINANCIAL NEWS ENGINE ENDPOINTS
// ==========================================

router.get('/news', (req, res) => {
  const { category, search, limit, featured } = req.query;
  const articles = financialNewsEngine.getAllArticles({ category, search, limit, featured });
  res.json({
    data: articles,
    total: articles.length,
    categories: financialNewsEngine.categories
  });
});

router.get('/news/:id', (req, res) => {
  const article = financialNewsEngine.getArticleById(req.params.id);
  if (!article) {
    return res.status(404).json({ error: 'Article not found.' });
  }
  res.json({ data: article });
});

router.post('/news', requireAuth, (req, res) => {
  const article = financialNewsEngine.createArticle(req.body);
  store.addLog('CMS', `Article published: "${article.headline}" by ${req.user.name}`);
  res.status(201).json({ success: true, data: article });
});

router.put('/news/:id', requireAuth, (req, res) => {
  const updated = financialNewsEngine.updateArticle(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Article not found.' });
  }
  store.addLog('CMS', `Article updated: "${updated.headline}"`);
  res.json({ success: true, data: updated });
});

router.delete('/news/:id', requireAuth, (req, res) => {
  const deleted = financialNewsEngine.deleteArticle(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Article not found.' });
  }
  store.addLog('CMS', `Article deleted ID: ${req.params.id}`);
  res.json({ success: true, message: 'Article deleted successfully.' });
});

// ==========================================
// 3. INSTITUTIONAL RESEARCH ENDPOINTS
// ==========================================

router.get('/research', (req, res) => {
  const { sector, reportType, search } = req.query;
  const reports = researchService.getAllReports({ sector, reportType, search });
  res.json({ data: reports, total: reports.length });
});

router.get('/research/:id', (req, res) => {
  const report = researchService.getReportById(req.params.id);
  if (!report) {
    return res.status(404).json({ error: 'Research report not found.' });
  }
  res.json({ data: report });
});

router.post('/research', requireAuth, (req, res) => {
  const report = researchService.createReport(req.body);
  store.addLog('RESEARCH', `Research published: "${report.title}"`);
  res.status(201).json({ success: true, data: report });
});

// ==========================================
// 4. ECONOMIC CALENDAR ENDPOINTS
// ==========================================

router.get('/calendar', (req, res) => {
  const { country, importance, dateFrom, dateTo } = req.query;
  const events = calendarService.getEvents({ country, importance, dateFrom, dateTo });
  res.json({ data: events, total: events.length });
});

// ==========================================
// 5. COMPANY PROFILES ENDPOINTS
// ==========================================

router.get('/companies', (req, res) => {
  const list = companyService.getAllCompanies();
  res.json({ data: list });
});

router.get('/companies/:ticker', (req, res) => {
  const profile = companyService.getProfile(req.params.ticker);
  if (!profile) {
    return res.status(404).json({ error: 'Company profile not found in directory.' });
  }
  res.json({ data: profile });
});

// ==========================================
// 6. WATCHLIST ENDPOINTS
// ==========================================

router.get('/watchlist', (req, res) => {
  const tickers = store.getWatchlist();
  const quotes = tickers.map(t => marketDataService.getQuote(t)).filter(Boolean);
  res.json({ tickers, quotes });
});

router.post('/watchlist/toggle', (req, res) => {
  const { ticker } = req.body;
  if (!ticker) {
    return res.status(400).json({ error: 'Ticker is required.' });
  }
  const result = store.toggleWatchlist(ticker.toUpperCase());
  res.json(result);
});

// ==========================================
// 7. AUTH & ADMIN CMS ENDPOINTS
// ==========================================

router.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = store.verifyAdmin(email, password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid administrative credentials.' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role },
    config.jwtSecret,
    { expiresIn: '12h' }
  );

  res.json({
    success: true,
    token,
    user: { id: user.id, email: user.email, name: user.name, role: user.role }
  });
});

router.get('/auth/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

router.get('/admin/metrics', requireAuth, (req, res) => {
  res.json({
    totalArticles: financialNewsEngine.getAllArticles().length,
    totalReports: researchService.getAllReports().length,
    activeWsConnections: marketDataService.subscribers.size,
    bloombergStatus: bloombergService.getStatus(),
    logs: store.getLogs(),
    uptimeSeconds: Math.floor(process.uptime()),
    nodeVersion: process.version,
    memoryUsageMB: Math.round(process.memoryUsage().rss / (1024 * 1024))
  });
});

export default router;
