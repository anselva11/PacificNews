import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchCompanies } from '../services/api';
import { Building2, Search, ArrowRight } from 'lucide-react';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetchCompanies();
        if (res.data) setCompanies(res.data);
      } catch (e) {
        console.warn('Error loading companies:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = companies.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.ticker.toLowerCase().includes(search.toLowerCase()) ||
    c.sector.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 bg-white">
      {/* Header */}
      <div className="pb-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#800D1B] font-bold uppercase tracking-wider mb-1">
            <Building2 className="w-4 h-4" />
            <span>Corporate Fundamental Intelligence</span>
          </div>
          <h1 className="font-serif text-3xl font-black text-gray-900">
            Global Corporate Profiles
          </h1>
          <p className="text-xs text-gray-600 font-mono mt-1">
            Institutional financial statements, quarterly earnings beats, balance sheet leverage, and valuation ratios.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, ticker, or sector..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg text-xs font-mono bg-white border border-gray-300 outline-none text-gray-900 shadow-2xs"
          />
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(comp => (
          <Link
            key={comp.ticker}
            to={`/companies/${comp.ticker}`}
            className="p-5 rounded-lg bg-white border border-gray-200 hover:border-gray-300 shadow-xs transition space-y-3 flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-base text-gray-900 group-hover:text-[#800D1B] transition">
                  {comp.ticker}
                </span>
                <span className="text-[10px] font-mono text-gray-700 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded">
                  {comp.exchange}
                </span>
              </div>
              <h3 className="font-serif font-bold text-sm text-gray-900 mt-1">
                {comp.name}
              </h3>
              <p className="text-xs text-gray-600 mt-0.5">{comp.sector}</p>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100 text-[11px] font-mono">
              <div>
                <span className="text-gray-500 block text-[9px] font-semibold">MARKET CAP</span>
                <span className="font-bold text-gray-900 truncate block">{comp.marketCap}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[9px] font-semibold">P/E RATIO</span>
                <span className="font-bold text-gray-900">{comp.peRatio}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[9px] font-semibold">DIV YIELD</span>
                <span className="font-bold text-gray-900">{comp.dividendYield}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs font-mono font-bold text-[#800D1B]">
              <span>Open Institutional Profile</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
