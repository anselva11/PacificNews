import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5001,
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  jwtSecret: process.env.JWT_SECRET || 'pacific_capital_secret_key_inst_auth_2026_x89',
  
  // Bloomberg Enterprise Integration Configuration
  bloomberg: {
    enabled: process.env.BLOOMBERG_ENABLED === 'true',
    dlEndpoint: process.env.BLOOMBERG_DL_ENDPOINT || 'https://dl.bloomberg.com/api/v1',
    clientId: process.env.BLOOMBERG_CLIENT_ID || '',
    clientSecret: process.env.BLOOMBERG_CLIENT_SECRET || '',
    sapiHost: process.env.BLOOMBERG_SAPI_HOST || '',
    sapiPort: parseInt(process.env.BLOOMBERG_SAPI_PORT || '8194', 10),
    authToken: process.env.BLOOMBERG_AUTH_TOKEN || '',
    serviceName: '//blp/mktdata'
  },

  // Public live market feed configurations
  coinGeckoEnabled: process.env.COINGECKO_ENABLED !== 'false',
  financialDataProvider: process.env.FINANCIAL_DATA_PROVIDER || 'live_public_verified',
  
  // News engine configuration
  enableRssIngestion: process.env.ENABLE_RSS_INGESTION !== 'false',
  rssFetchIntervalMs: parseInt(process.env.RSS_FETCH_INTERVAL_MS || '300000', 10),

  // Redis
  useRedis: process.env.USE_REDIS === 'true',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379'
};
