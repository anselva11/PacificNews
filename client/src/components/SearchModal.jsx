import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, TrendingUp, FileText, BarChart2 } from 'lucide-react';
import { useMarket } from '../context/MarketContext';
import { fetchNews, fetchResearch } from '../services/api';

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [articles, setArticles] = useState([]);
  const [research, setResearch] = useState([]);
  const { quotes } = useMarket();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      return;
    }

    const handler = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setArticles([]);
      setResearch([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const [newsRes, resRes] = await Promise.all([
          fetchNews({ search: query, limit: 5 }),
          fetchResearch({ search: query })
        ]);
        if (newsRes.data) setArticles(newsRes.data);
        if (resRes.data) setResearch(resRes.data);
      } catch (e) {
        console.warn('Search query error:', e);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const filteredQuotes = query.trim()
    ? quotes.filter(q => 
        q.name.toLowerCase().includes(query.toLowerCase()) || 
        q.id.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 4)
    : [];

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 px-4">
      <div className="bg-white border border-gray-300 rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-gray-200 bg-white">
          <Search className="w-5 h-5 text-gray-500 mr-3" />
          <input
            type="text"
            placeholder="Search financial news, equity research, macro themes, or market tickers..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent border-none outline-none text-sm sm:text-base text-gray-900 placeholder-gray-500 font-sans"
          />
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100 text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-4 bg-white">
          {/* Market Instruments */}
          {filteredQuotes.length > 0 && (
            <div>
              <div className="text-[11px] font-bold font-mono text-gray-600 uppercase tracking-wider mb-2 flex items-center">
                <TrendingUp className="w-3.5 h-3.5 mr-1 text-[#800D1B]" />
                Market Instruments
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {filteredQuotes.map(q => (
                  <div
                    key={q.id}
                    onClick={() => {
                      navigate(`/markets`);
                      onClose();
                    }}
                    className="p-2.5 rounded bg-gray-50 hover:bg-gray-100 cursor-pointer flex items-center justify-between border border-gray-200 transition"
                  >
                    <div>
                      <span className="font-bold text-xs font-mono text-gray-900">{q.id}</span>
                      <p className="text-[11px] text-gray-600">{q.name}</p>
                    </div>
                    <div className="text-right font-mono text-xs">
                      <p className="font-bold text-gray-900">{q.price !== null ? q.price : 'N/A'}</p>
                      <p className={q.changePercent >= 0 ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}>
                        {q.changePercent !== null ? `${q.changePercent > 0 ? '+' : ''}${q.changePercent}%` : '-'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Research Reports */}
          {research.length > 0 && (
            <div>
              <div className="text-[11px] font-bold font-mono text-gray-600 uppercase tracking-wider mb-2 flex items-center">
                <BarChart2 className="w-3.5 h-3.5 mr-1 text-[#800D1B]" />
                Institutional Research
              </div>
              <div className="space-y-1.5">
                {research.map(r => (
                  <div
                    key={r.id}
                    onClick={() => {
                      navigate(`/research/${r.id}`);
                      onClose();
                    }}
                    className="p-2.5 rounded hover:bg-gray-50 cursor-pointer border border-transparent hover:border-gray-200 transition"
                  >
                    <div className="flex items-center space-x-2 text-[10px] font-mono text-[#800D1B] font-bold uppercase">
                      <span>{r.reportType}</span>
                      <span>•</span>
                      <span>{r.sector}</span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-serif font-bold text-gray-900 hover:text-[#800D1B]">
                      {r.title}
                    </h4>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* News Articles */}
          {articles.length > 0 && (
            <div>
              <div className="text-[11px] font-bold font-mono text-gray-600 uppercase tracking-wider mb-2 flex items-center">
                <FileText className="w-3.5 h-3.5 mr-1 text-gray-800" />
                Financial Reporting
              </div>
              <div className="space-y-1.5">
                {articles.map(a => (
                  <div
                    key={a.id}
                    onClick={() => {
                      navigate(`/news/${a.id}`);
                      onClose();
                    }}
                    className="p-2.5 rounded hover:bg-gray-50 cursor-pointer border border-transparent hover:border-gray-200 transition"
                  >
                    <div className="flex items-center space-x-2 text-[10px] font-mono text-gray-500">
                      <span>{a.category}</span>
                      <span>•</span>
                      <span>{new Date(a.publishedAt).toLocaleDateString()}</span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-serif font-bold text-gray-900 hover:text-[#800D1B]">
                      {a.headline}
                    </h4>
                  </div>
                ))}
              </div>
            </div>
          )}

          {query.trim() && filteredQuotes.length === 0 && research.length === 0 && articles.length === 0 && (
            <div className="text-center py-8 text-gray-500 text-xs">
              No matching financial intelligence found for "{query}".
            </div>
          )}

          {!query.trim() && (
            <div className="py-6 text-center text-gray-500 text-xs font-mono">
              Type to query institutional news, equity research, commodities, or sovereign yield curves.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
