import { initialCompanyProfiles } from '../data/initialData.js';
import axios from 'axios';

/**
 * PACIFIC CAPITAL NEWS - COMPANY PROFILE SERVICE
 * 
 * Individual company pages with:
 * - Company overview
 * - Stock ticker
 * - Market capitalization
 * - Revenue
 * - Net income
 * - EPS
 * - P/E ratio
 * - P/B ratio
 * - Dividend yield
 * - Historical stock performance
 * - Quarterly earnings
 * - Financial statements
 * - Latest company news
 */
class CompanyProfileService {
  constructor() {
    this.profiles = new Map();
    for (const [ticker, profile] of Object.entries(initialCompanyProfiles)) {
      this.profiles.set(ticker, profile);
    }
  }

  getAllCompanies() {
    return Array.from(this.profiles.values()).map(p => ({
      ticker: p.ticker,
      name: p.name,
      exchange: p.exchange,
      sector: p.sector,
      marketCap: p.marketCap,
      peRatio: p.peRatio,
      dividendYield: p.dividendYield
    }));
  }

  getProfile(tickerKey) {
    const cleanKey = tickerKey.toUpperCase().replace('.JK', '');
    return this.profiles.get(cleanKey) || this.profiles.get(tickerKey.toUpperCase()) || null;
  }
}

export const companyService = new CompanyProfileService();
