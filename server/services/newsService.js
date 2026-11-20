import Parser from 'rss-parser';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { initialArticles } from '../data/initialData.js';

const rssParser = new Parser({
  customFields: {
    item: [
      ['media:content', 'media'],
      ['content:encoded', 'contentEncoded'],
      ['dc:creator', 'creator']
    ]
  }
});

/**
 * PACIFIC CAPITAL NEWS - FINANCIAL NEWS ENGINE
 * 
 * Ingests authentic financial wire stories from authorized public RSS/Atom feeds:
 * - SEC EDGAR News & Press Releases
 * - Federal Reserve Board Monetary Policy & Speeches
 * - MarketWatch / Yahoo Finance institutional market updates
 * Plus Pacific Capital Editorial desk articles.
 * 
 * Strict integrity:
 * - Real dates, original URLs, real sources.
 * - No fake articles or false attribution.
 */
class FinancialNewsEngine {
  constructor() {
    this.articles = new Map();
    this.categories = [
      'All',
      'Global Economy',
      'Stock Markets',
      'Corporate Earnings',
      'Central Banks',
      'Monetary Policy',
      'Interest Rates',
      'Mergers & Acquisitions',
      'IPO',
      'Commodities',
      'Technology',
      'Geopolitics'
    ];

    // Seed with high-caliber Pacific Capital News editorial articles
    for (const article of initialArticles) {
      this.articles.set(article.id, article);
    }
  }

  async startIngestion() {
    // Initial fetch from live public wires
    await this.fetchLiveFinancialWires();

    // Fetch periodically every 5 minutes
    setInterval(() => {
      this.fetchLiveFinancialWires();
    }, 300000);
  }

  async fetchLiveFinancialWires() {
    const feeds = [
      {
        url: 'https://www.sec.gov/news/pressreleases.rss',
        source: 'U.S. Securities & Exchange Commission (SEC EDGAR)',
        category: 'Stock Markets',
        defaultImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80'
      },
      {
        url: 'https://www.federalreserve.gov/feeds/press_monetary.xml',
        source: 'Federal Reserve Board',
        category: 'Monetary Policy',
        defaultImage: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1200&q=80'
      },
      {
        url: 'https://feeds.content.dowjones.io/public/rss/mw_topstories',
        source: 'MarketWatch Financial Network',
        category: 'Global Economy',
        defaultImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80'
      }
    ];

    for (const feed of feeds) {
      try {
        const parsed = await rssParser.parseURL(feed.url);
        if (parsed.items && parsed.items.length > 0) {
          // Ingest up to 5 latest authentic wire items per feed
          for (const item of parsed.items.slice(0, 5)) {
            const id = 'wire_' + Buffer.from(item.link || item.guid || item.title).toString('base64').substring(0, 16);
            if (!this.articles.has(id)) {
              // Categorize heuristically based on keywords
              const category = this.categorizeText(item.title + ' ' + (item.contentSnippet || ''), feed.category);
              
              const article = {
                id,
                headline: item.title?.trim() || 'Market Intelligence Update',
                summary: (item.contentSnippet || item.summary || item.title || '').trim().substring(0, 320) + '...',
                content: item.content || item.contentEncoded || item.contentSnippet || item.title,
                publishedAt: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                author: item.creator || item.author || `${feed.source} Newsdesk`,
                source: feed.source,
                sourceUrl: item.link || '',
                category,
                imageUrl: item.media?.$?.url || feed.defaultImage,
                isFeatured: false,
                isBreaking: false,
                isPacificOriginal: false,
                readTime: '3 min read',
                relatedTickers: this.extractTickers(item.title + ' ' + (item.contentSnippet || ''))
              };

              this.articles.set(id, article);
            }
          }
        }
      } catch (err) {
        console.warn(`[NewsEngine] RSS fetch note for ${feed.source}:`, err.message);
      }
    }
  }

  categorizeText(text, fallback) {
    const lower = text.toLowerCase();
    if (lower.includes('rate') || lower.includes('basis point') || lower.includes('yield') || lower.includes('fomc') || lower.includes('ecb') || lower.includes('central bank')) {
      return lower.includes('rate') ? 'Interest Rates' : 'Monetary Policy';
    }
    if (lower.includes('earnings') || lower.includes('revenue') || lower.includes('profit') || lower.includes('guidance')) {
      return 'Corporate Earnings';
    }
    if (lower.includes('ipo') || lower.includes('public offering')) {
      return 'IPO';
    }
    if (lower.includes('merger') || lower.includes('acquisition') || lower.includes('buyout') || lower.includes('deal')) {
      return 'Mergers & Acquisitions';
    }
    if (lower.includes('crude') || lower.includes('oil') || lower.includes('gold') || lower.includes('commodity') || lower.includes('gas')) {
      return 'Commodities';
    }
    if (lower.includes('ai') || lower.includes('semiconductor') || lower.includes('chip') || lower.includes('software') || lower.includes('cloud')) {
      return 'Technology';
    }
    if (lower.includes('tariff') || lower.includes('sanction') || lower.includes('china') || lower.includes('war') || lower.includes('trade')) {
      return 'Geopolitics';
    }
    return fallback;
  }

  extractTickers(text) {
    const known = ['SPX', 'IXIC', 'DJI', 'NVDA', 'AAPL', 'MSFT', 'BTC', 'ETH', 'GOLD', 'WTI'];
    const found = [];
    for (const t of known) {
      if (text.toUpperCase().includes(t)) {
        found.push(t);
      }
    }
    return found.slice(0, 3);
  }

  getAllArticles({ category, search, limit = 50, featured } = {}) {
    let list = Array.from(this.articles.values());

    if (category && category !== 'All') {
      list = list.filter(a => a.category.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(a => a.headline.toLowerCase().includes(q) || a.summary.toLowerCase().includes(q));
    }

    if (featured !== undefined) {
      list = list.filter(a => a.isFeatured === (featured === 'true' || featured === true));
    }

    // Sort by publication date descending
    list.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    return list.slice(0, parseInt(limit, 10));
  }

  getArticleById(id) {
    return this.articles.get(id) || null;
  }

  createArticle(data) {
    const id = 'pcn_' + uuidv4().substring(0, 8);
    const article = {
      id,
      headline: data.headline,
      summary: data.summary,
      content: data.content,
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: data.author || 'Pacific Capital Editorial Bureau',
      source: 'Pacific Capital News',
      sourceUrl: data.sourceUrl || '',
      category: data.category || 'Global Economy',
      imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
      isFeatured: !!data.isFeatured,
      isBreaking: !!data.isBreaking,
      isPacificOriginal: true,
      readTime: data.readTime || '4 min read',
      relatedTickers: data.relatedTickers || []
    };

    this.articles.set(id, article);
    return article;
  }

  updateArticle(id, updates) {
    const existing = this.articles.get(id);
    if (!existing) return null;

    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.articles.set(id, updated);
    return updated;
  }

  deleteArticle(id) {
    return this.articles.delete(id);
  }
}

export const financialNewsEngine = new FinancialNewsEngine();
