# PACIFIC CAPITAL NEWS
### Global Financial News & Market Intelligence
*"See Beyond The Market."*

A publication of **PACIFIC INVESTMENT CAPITAL HOLDINGS**  
Singapore • New York • London • Jakarta • Tokyo

---

## 1. EXECUTIVE OVERVIEW

**PACIFIC CAPITAL NEWS** is a premium institutional financial news and market intelligence platform inspired by the editorial precision, information architecture, and data density of global institutional market leaders like Bloomberg Markets, while maintaining its own distinct brand identity, typography, and visual language.

The platform provides institutional asset allocators, portfolio managers, investment banking analysts, and macroeconomic researchers with:
- Editorial-grade three-column financial news layout
- Real-time streaming market dashboard with WebSocket updates
- Interactive TradingView Lightweight Charts™ with multiple timeframes and volume overlays
- Institutional Equity & Macroeconomic Research dossiers
- Verifiable Global Economic Calendar with central bank and G20 releases
- Individual Corporate Profiles with financial statements, quarterly earnings beats, and valuation ratios
- Secure Administrative CMS Console for editorial dispatches, research publishing, and feed telemetry

---

## 2. BRAND IDENTITY & DESIGN SYSTEM

- **Brand:** PACIFIC CAPITAL NEWS
- **Parent Organization:** PACIFIC INVESTMENT CAPITAL HOLDINGS
- **Tagline:** "Global Financial News & Market Intelligence" / "See Beyond The Market."
- **Primary Color:** Deep Navy (`#071426`, `#040B15`)
- **Secondary Color:** Burgundy (`#800D1B`)
- **Accent & Highlights:** Light Gray (`#F1F3F5`), Institutional Gold (`#C5A059`)
- **Typography:** 
  - Serif Headings: *Merriweather* / *Georgia* (editorial gravity)
  - Interface & Body: *Inter* (high readability and clarity)
  - Financial Data: *JetBrains Mono* with `font-tabular` (strict tabular numerical alignment)

---

## 3. TECHNOLOGY STACK

### Frontend
- **Framework:** React.js (v18) + Vite
- **Styling:** Tailwind CSS (custom institutional color palette and high-density layouts)
- **Visuals & Charts:** TradingView Lightweight Charts (`lightweight-charts`)
- **Icons:** Lucide React (`lucide-react`)
- **State & Feeds:** React Context (`MarketContext`, `ThemeContext`, `WatchlistContext`)
- **Transport:** WebSocket (`ws://`) for live price ticks and reconnect logic

### Backend
- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js
- **Streaming:** Native WebSocket Server (`ws`)
- **News Ingestion:** Automated RSS/Atom Ingestion Engine (`rss-parser`, `axios`)
- **Security & CMS Auth:** JSON Web Tokens (JWT) + `bcryptjs`
- **Data Persistence:** Persistent file-backed store (`server/data/store.js` + `db.json`)

---

## 4. MARKET ASSETS COVERAGE (SECTION 5)

All 21 required instruments across 4 core asset classes are tracked:

1. **EQUITY INDICES:**
   - S&P 500 (`SPX`)
   - NASDAQ Composite (`IXIC`)
   - Dow Jones Industrial Average (`DJI`)
   - FTSE 100 (`FTSE`)
   - DAX 40 (`DAX`)
   - Nikkei 225 (`N225`)
   - Hang Seng Index (`HSI`)
   - Jakarta Composite Index (`IHSG` / `^JKSE`)

2. **FOREX:**
   - EUR/USD (`EUR_USD`)
   - GBP/USD (`GBP_USD`)
   - USD/JPY (`USD_JPY`)
   - USD/IDR (`USD_IDR`)
   - AUD/USD (`AUD_USD`)

3. **COMMODITIES:**
   - Gold Spot (`GOLD` / `GC=F`)
   - Silver Spot (`SILVER` / `SI=F`)
   - WTI Crude Oil (`WTI` / `CL=F`)
   - Brent Crude Oil (`BRENT` / `BZ=F`)
   - Natural Gas (`NATGAS` / `NG=F`)

4. **DIGITAL ASSETS (CRYPTO):**
   - Bitcoin (`BTC`)
   - Ethereum (`ETH`)
   - Solana (`SOL`)

### Data Integrity Guarantee
- Every quote displays: **Latest Price**, **Absolute Change**, **Percentage Change**, **High/Low**, **Trading Volume**, **Last Update Timestamp**, and **Data Source Attribution**.
- Green represents positive movement, and Red represents negative movement.
- **CRITICAL COMPLIANCE:** All displayed market values come strictly from real connected data providers (e.g. CoinGecko Live API for crypto, European Central Bank / Frankfurt Exchange for FX, Global Financial Network).
- **NO FAKE OR RANDOM PRICES:** When external feeds are disconnected, the platform explicitly displays `"LIVE DATA FEED NOT CONNECTED"` rather than fabricating simulated figures.

---

## 5. BLOOMBERG DATA INTEGRATION & LICENSING (SECTION 6)

The platform features a dedicated Bloomberg Data Service (`server/services/bloombergService.js`):
- Keeps credentials securely on the backend (`server/.env`). Never exposes secrets to frontend client scripts.
- Supports **Bloomberg Data License REST API** and **Bloomberg Server API (SAPI)** configurations.
- Implements institutional data normalization, exchange timezones (`America/New_York`, `Europe/London`, `Asia/Tokyo`, `Asia/Jakarta`, `UTC`), and delayed vs real-time vs EOD tagging.
- **Licensing Compliance:** If Bloomberg credentials are not provided in `.env`, the service displays a clear **`BLOOMBERG SAPI: STANDBY (Awaiting DL/SAPI Authorization)`** status and falls back to verified public feeds. No scraping of Bloomberg.com is ever performed.

### Bloomberg Environment Configuration (`server/.env`):
```env
BLOOMBERG_ENABLED=false
BLOOMBERG_DL_ENDPOINT=https://dl.bloomberg.com/api/v1
BLOOMBERG_CLIENT_ID=your_client_id_here
BLOOMBERG_CLIENT_SECRET=your_client_secret_here
BLOOMBERG_SAPI_HOST=127.0.0.1
BLOOMBERG_SAPI_PORT=8194
BLOOMBERG_AUTH_TOKEN=your_auth_token_here
```

---

## 6. FINANCIAL NEWS & RESEARCH ENGINES

### Automated Financial News Engine
- Ingests verified institutional dispatches from:
  - U.S. Securities & Exchange Commission (SEC EDGAR)
  - Federal Reserve Board Monetary Policy Releases
  - MarketWatch / Yahoo Finance Financial Network
- Categorized into 11 distinct editorial desks: *Global Economy*, *Stock Markets*, *Corporate Earnings*, *Central Banks*, *Monetary Policy*, *Interest Rates*, *Mergers & Acquisitions*, *IPO*, *Commodities*, *Technology*, *Geopolitics*.
- Every article includes headline, summary, content, publication timestamp, author, source, and original article URL.

### Institutional Research Section
- Comprehensive research dossiers across *Equity Research*, *Macroeconomic Research*, *Technical Analysis*, *Fundamental Analysis*, *Sector Reports*, and *Valuation Analysis*.
- Each report includes:
  1. Executive Summary
  2. Market Overview & Industry Dynamics
  3. Key Financial Metrics Matrix
  4. Valuation Methodology & Multiples
  5. Institutional Risk Assessment
  6. Pacific Capital Investment Thesis
  7. References & Academic Citations

---

## 7. ECONOMIC CALENDAR & COMPANY PROFILES

### Economic Calendar
- Displays verifiable schedule of G20 central bank meetings, Non-Farm Payrolls, CPI, and GDP data prints.
- Includes Event name, Country, Date/Time (UTC), Importance (HIGH, MEDIUM, LOW), Consensus Forecast, Previous, and Actual.

### Company Profiles
- Full institutional balance sheet and earnings profile for blue-chips (e.g., Apple `AAPL`, NVIDIA `NVDA`, Bank Central Asia `BBCA.JK`, TSMC `TSM`).
- Displays Market Cap, Revenue, Net Income, EPS, P/E, P/B, Dividend Yield, Interactive TradingView Chart, and Quarterly Earnings Surprises.

---

## 8. CMS ADMIN CONSOLE

Access the secure CMS portal via `/admin` or the **Terminal CMS** button in the header.

**Default Administrator Credentials:**
- **Email:** `admin@pacificcapital.com`
- **Password:** `PacificCapital2026!`
- **Role:** `SUPER_ADMIN` / Chief Investment Officer

Features:
- Create and edit breaking news dispatches
- Publish complete institutional research dossiers
- Real-time telemetry: WebSocket connections, memory usage, server uptime
- Bloomberg SAPI / Data License health and compliance diagnostics
- System security audit log trail

---

## 9. QUICK START GUIDE

### Option A: Run Full Stack (Single Production Server)
```bash
# 1. Build the frontend client
cd client
npm run build

# 2. Start the Express backend + static server
cd ../server
npm start
```
Open **`http://localhost:5000`** in your browser.

### Option B: Run in Development Mode (Hot Reload)
```bash
# In the project root:
npm run dev
```
- Client runs on `http://localhost:3000`
- Server runs on `http://localhost:5000` (proxied automatically)

---

## 10. EDITORIAL & LEGAL DISCLAIMER

Market data delivered via Bloomberg Data License (DL) or authorized market feeds is subject to redistribution rules and proprietary intellectual property notices. Pacific Capital News guarantees verifiable data integrity without simulated or fabricated financial values. Nothing published constitutes personal investment advice.
