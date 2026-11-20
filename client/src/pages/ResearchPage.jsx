import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchResearch } from '../services/api';
import { ShieldCheck, ArrowRight, Search } from 'lucide-react';

export default function ResearchPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const reportTypes = [
    'All',
    'Equity Research',
    'Macroeconomic Research',
    'Technical Analysis',
    'Sector Reports',
    'Valuation Analysis'
  ];

  useEffect(() => {
    async function loadReports() {
      setLoading(true);
      try {
        const res = await fetchResearch({ reportType: selectedType, search: searchQuery });
        if (res.data) setReports(res.data);
      } catch (e) {
        console.warn('Error loading research:', e);
      } finally {
        setLoading(false);
      }
    }
    loadReports();
  }, [selectedType, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 bg-white">
      {/* Page Header */}
      <div className="pb-4 border-b border-gray-200">
        <div className="flex items-center space-x-2 text-xs font-mono text-[#800D1B] font-bold uppercase tracking-wider mb-1">
          <ShieldCheck className="w-4 h-4" />
          <span>Pacific Investment Capital Holdings • Research Division</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-black text-gray-900">
          Institutional Market Analysis & Research
        </h1>
        <p className="text-xs text-gray-600 font-mono mt-1">
          Proprietary macroeconomic forecasting, equity valuation models, sector outlooks, and multi-asset capital allocation frameworks.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
        {/* Type pills */}
        <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto">
          {reportTypes.map(t => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-3 py-1.5 rounded text-xs font-mono font-bold whitespace-nowrap transition ${
                selectedType === t
                  ? 'bg-[#071426] text-white shadow-xs'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search reports or tickers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded text-xs font-mono bg-white border border-gray-300 outline-none text-gray-900"
          />
        </div>
      </div>

      {/* Research Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((report) => (
          <div
            key={report.id}
            className="p-5 rounded-lg bg-white border border-gray-200 hover:border-gray-300 shadow-xs flex flex-col justify-between transition group"
          >
            <div>
              {/* Top Tags */}
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="text-[#800D1B] font-bold uppercase tracking-wider">
                  {report.reportType}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  report.rating === 'BUY' || report.rating === 'OVERWEIGHT'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-gray-100 text-gray-800 border border-gray-200'
                }`}>
                  {report.rating}
                </span>
              </div>

              {/* Title */}
              <Link to={`/research/${report.id}`}>
                <h3 className="font-serif font-bold text-lg text-gray-900 group-hover:text-[#800D1B] transition-colors leading-snug mb-2">
                  {report.title}
                </h3>
              </Link>

              {/* Summary */}
              <p className="text-xs text-gray-600 leading-relaxed mb-4 line-clamp-3">
                {report.summary}
              </p>

              {/* Key Financial Metrics Highlights */}
              {report.financialMetrics && Object.keys(report.financialMetrics).length > 0 && (
                <div className="bg-gray-50 p-2.5 rounded border border-gray-200 text-[11px] font-mono grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                  {Object.entries(report.financialMetrics).slice(0, 3).map(([k, v]) => (
                    <div key={k}>
                      <span className="text-gray-500 block uppercase text-[9px] font-semibold">{k}</span>
                      <span className="font-bold text-gray-900">{v}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Meta & Action */}
            <div className="pt-3 border-t border-gray-200 flex items-center justify-between text-xs font-mono">
              <div className="text-gray-500 text-[11px]">
                <span>By {report.author.split('&')[0]}</span>
                <span className="mx-1">•</span>
                <span>{report.date}</span>
              </div>
              <Link
                to={`/research/${report.id}`}
                className="font-bold text-[#800D1B] hover:underline flex items-center"
              >
                <span>Full Thesis</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
