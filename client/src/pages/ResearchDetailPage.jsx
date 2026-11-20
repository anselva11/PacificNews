import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchResearchReport } from '../services/api';
import { ArrowLeft, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function ResearchDetailPage() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const res = await fetchResearchReport(id);
        if (res.data) setReport(res.data);
      } catch (e) {
        console.warn('Error loading research report:', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center font-mono text-xs text-gray-500">
        LOADING INSTITUTIONAL VALUATION DOSSIER...
      </div>
    );
  }

  if (!report) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-xl font-bold text-gray-900">Research Report Not Found</h2>
        <Link to="/research" className="inline-block mt-4 text-xs font-mono font-bold text-[#800D1B] underline">
          Return to Research Portal
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6 bg-white">
      {/* Back button */}
      <Link
        to="/research"
        className="inline-flex items-center text-xs font-mono font-bold text-gray-600 hover:text-gray-900 transition"
      >
        <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
        BACK TO RESEARCH UNIVERSE
      </Link>

      {/* Institutional Dossier Header */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center space-x-2">
            <span className="bg-[#800D1B] text-white px-2.5 py-0.5 rounded font-bold uppercase tracking-wider text-[10px]">
              {report.reportType}
            </span>
            <span className="text-gray-900 font-bold uppercase">{report.sector}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-500">RATING:</span>
            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-bold">
              {report.rating}
            </span>
          </div>
        </div>

        <h1 className="font-serif text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
          {report.title}
        </h1>

        <div className="text-xs font-mono text-gray-700 flex flex-wrap items-center justify-between border-t border-gray-200 pt-3 gap-2">
          <div>
            <span className="text-gray-500">Analyst:</span> <strong className="text-gray-900">{report.author}</strong>
          </div>
          <div>
            <span className="text-gray-500">Date:</span> {report.date}
          </div>
          <div>
            <span className="text-[#800D1B] font-bold">{report.targetPriceContext}</span>
          </div>
        </div>
      </div>

      {/* 1. Executive Summary */}
      <section className="bg-white p-6 rounded-lg border border-gray-200 space-y-2 shadow-2xs">
        <h2 className="font-serif font-black text-base uppercase tracking-wider text-gray-900 border-b border-gray-200 pb-2">
          1. Executive Summary
        </h2>
        <p className="text-sm text-gray-700 leading-relaxed font-sans pt-2">
          {report.executiveSummary}
        </p>
      </section>

      {/* 2. Market Overview */}
      <section className="bg-white p-6 rounded-lg border border-gray-200 space-y-2 shadow-2xs">
        <h2 className="font-serif font-black text-base uppercase tracking-wider text-gray-900 border-b border-gray-200 pb-2">
          2. Market Overview & Industry Dynamics
        </h2>
        <p className="text-sm text-gray-700 leading-relaxed font-sans pt-2">
          {report.marketOverview}
        </p>
      </section>

      {/* 3. Financial Metrics Matrix */}
      {report.financialMetrics && Object.keys(report.financialMetrics).length > 0 && (
        <section className="bg-white p-6 rounded-lg border border-gray-200 space-y-3 shadow-2xs">
          <h2 className="font-serif font-black text-base uppercase tracking-wider text-gray-900 border-b border-gray-200 pb-2">
            3. Key Financial Metrics & Forecasting
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
            {Object.entries(report.financialMetrics).map(([metric, val]) => (
              <div key={metric} className="p-3 rounded bg-gray-50 border border-gray-200 font-mono">
                <span className="text-[10px] text-gray-500 uppercase block font-semibold">{metric}</span>
                <span className="text-sm font-black text-gray-900 mt-1 block">{val}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. Valuation Analysis */}
      <section className="bg-white p-6 rounded-lg border border-gray-200 space-y-2 shadow-2xs">
        <h2 className="font-serif font-black text-base uppercase tracking-wider text-gray-900 border-b border-gray-200 pb-2">
          4. Valuation Methodology & Multiples
        </h2>
        <p className="text-sm text-gray-700 leading-relaxed font-sans pt-2">
          {report.valuationAnalysis}
        </p>
      </section>

      {/* 5. Risk Assessment */}
      <section className="bg-white p-6 rounded-lg border border-gray-200 space-y-2 shadow-2xs">
        <h2 className="font-serif font-black text-base uppercase tracking-wider text-gray-900 border-b border-gray-200 pb-2 flex items-center text-rose-700">
          <AlertTriangle className="w-4 h-4 mr-2" />
          5. Institutional Risk Assessment
        </h2>
        <p className="text-sm text-gray-700 leading-relaxed font-sans pt-2">
          {report.riskAssessment}
        </p>
      </section>

      {/* 6. Investment Thesis */}
      <section className="bg-gray-50 p-6 rounded-lg border border-gray-200 space-y-2 shadow-2xs">
        <h2 className="font-serif font-black text-base uppercase tracking-wider text-gray-900 border-b border-gray-200 pb-2 flex items-center text-[#800D1B]">
          <CheckCircle2 className="w-4 h-4 mr-2" />
          6. Pacific Capital Investment Thesis
        </h2>
        <p className="text-sm text-gray-800 leading-relaxed font-sans pt-2 font-medium">
          {report.investmentThesis}
        </p>
      </section>

      {/* 7. References and Sources */}
      {report.references && report.references.length > 0 && (
        <section className="p-4 rounded-lg bg-gray-50 border border-gray-200 text-xs font-mono text-gray-600 space-y-2">
          <strong className="text-gray-900 block uppercase font-bold">7. References & Academic Citations</strong>
          <ul className="list-disc list-inside space-y-1">
            {report.references.map((ref, idx) => (
              <li key={idx}>{ref}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
