import { initialResearchReports } from '../data/initialData.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * PACIFIC CAPITAL NEWS - INSTITUTIONAL RESEARCH SERVICE
 * 
 * Supports:
 * - Equity Research
 * - Technical Analysis
 * - Fundamental Analysis
 * - Macroeconomic Research
 * - Sector Reports
 * - Earnings Analysis
 * - Investment Outlook
 * 
 * Each report contains:
 * - Executive Summary
 * - Market Overview
 * - Financial Metrics
 * - Valuation Analysis
 * - Risk Assessment
 * - Investment Thesis
 * - References and Sources
 * 
 * Clearly distinguishes Pacific Research from third-party reporting.
 */
class InstitutionalResearchService {
  constructor() {
    this.reports = new Map();
    for (const report of initialResearchReports) {
      this.reports.set(report.id, report);
    }
  }

  getAllReports({ sector, reportType, search } = {}) {
    let list = Array.from(this.reports.values());

    if (sector && sector !== 'All') {
      list = list.filter(r => r.sector.toLowerCase().includes(sector.toLowerCase()));
    }

    if (reportType && reportType !== 'All') {
      list = list.filter(r => r.reportType.toLowerCase() === reportType.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(r => 
        r.title.toLowerCase().includes(q) || 
        r.summary.toLowerCase().includes(q) ||
        r.executiveSummary?.toLowerCase().includes(q)
      );
    }

    // Sort by publication date
    list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return list;
  }

  getReportById(id) {
    return this.reports.get(id) || null;
  }

  createReport(data) {
    const id = 'res_' + uuidv4().substring(0, 8);
    const report = {
      id,
      title: data.title,
      reportType: data.reportType || 'Equity Research',
      sector: data.sector || 'General',
      coverageUniverse: data.coverageUniverse || [],
      author: data.author || 'Pacific Capital Research Desk',
      date: new Date().toISOString().split('T')[0],
      rating: data.rating || 'OVERWEIGHT',
      targetPriceContext: data.targetPriceContext || '',
      isPacificOriginal: true,
      summary: data.summary,
      executiveSummary: data.executiveSummary,
      marketOverview: data.marketOverview,
      financialMetrics: data.financialMetrics || {},
      valuationAnalysis: data.valuationAnalysis,
      riskAssessment: data.riskAssessment,
      investmentThesis: data.investmentThesis,
      references: data.references || ['Pacific Capital Internal Models']
    };

    this.reports.set(id, report);
    return report;
  }

  updateReport(id, updates) {
    const existing = this.reports.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...updates };
    this.reports.set(id, updated);
    return updated;
  }

  deleteReport(id) {
    return this.reports.delete(id);
  }
}

export const researchService = new InstitutionalResearchService();
