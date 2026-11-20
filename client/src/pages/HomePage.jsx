import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, ShieldCheck, ArrowRight, ChevronRight, Activity, Globe } from 'lucide-react';
import { fetchNews, fetchResearch } from '../services/api';
import { useMarket } from '../context/MarketContext';

export default function HomePage() {
  const [articles, setArticles] = useState([]);
  const [researchList, setResearchList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { quotes, marketTimes } = useMarket();

  useEffect(() => {
    async function loadContent() {
      try {
        const [newsRes, resRes] = await Promise.all([
          fetchNews({ limit: 15 }),
          fetchResearch()
        ]);
        if (newsRes.data) setArticles(newsRes.data);
        if (resRes.data) setResearchList(resRes.data);
      } catch (e) {
        console.warn('Error loading homepage news:', e);
      } finally {
        setLoading(false);
      }
    }
    loadContent();
  }, []);

  const leadArticle = articles.find(a => a.isFeatured) || articles[0];
  const secondaryArticles = articles.filter(a => a.id !== leadArticle?.id).slice(0, 4);
  const wireArticles = articles.filter(a => a.id !== leadArticle?.id).slice(4, 12);
  const featuredResearch = researchList[0];

  const formatPrice = (val, id) => {
    if (val === null || val === undefined) return 'N/A';
    if (id?.includes('IDR')) return val.toLocaleString('en-US', { maximumFractionDigits: 0 });
    return val < 2 ? val.toFixed(4) : val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 bg-white">
      {/* Institutional Top Breaking Banner */}
      <div className="bg-gray-50 border-l-4 border-[#800D1B] border-t border-r border-b border-gray-200 p-3 mb-6 flex flex-wrap items-center justify-between text-xs font-mono rounded-r">
        <div className="flex items-center space-x-2">
          <span className="bg-[#800D1B] text-white px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase">
            BREAKING INTEL
          </span>
          <span className="text-gray-900 font-bold truncate max-w-xl">
            {leadArticle ? leadArticle.headline : 'Federal Reserve Weighs Neutral Rate Recalibration'}
          </span>
        </div>
        <div className="text-[11px] text-gray-500 hidden sm:flex items-center space-x-2">
          <span>SOURCE: PACIFIC EDITORIAL WIRE</span>
          <span>•</span>
          <span>{marketTimes.utc} UTC</span>
        </div>
      </div>

      {/* THREE-COLUMN EDITORIAL GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* COLUMN 1: LEFT SIDEBAR */}
        <div className="lg:col-span-3 space-y-6 order-2 lg:order-1">
          <div className="border-b-2 border-gray-900 pb-1.5 flex items-center justify-between">
            <h3 className="font-serif font-black text-sm uppercase tracking-wider text-gray-900 flex items-center">
              <Activity className="w-4 h-4 mr-1.5 text-[#800D1B]" />
              Market Wires
            </h3>
            <span className="text-[10px] font-mono text-emerald-700 font-bold flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse" />
              LIVE
            </span>
          </div>

          <div className="divide-y divide-gray-200 space-y-3">
            {wireArticles.map((item) => (
              <div key={item.id} className="pt-3 group">
                <div className="flex items-center justify-between text-[10px] font-mono text-gray-500 mb-1">
                  <span className="text-[#800D1B] font-bold uppercase tracking-wider">
                    {item.category}
                  </span>
                  <span>{new Date(item.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <Link
                  to={`/news/${item.id}`}
                  className="font-serif text-xs font-bold text-gray-900 group-hover:text-[#800D1B] transition-colors leading-snug block"
                >
                  {item.headline}
                </Link>
                <div className="text-[10px] text-gray-500 mt-1 flex items-center space-x-1">
                  <span>Source: {item.source}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
            <div className="flex items-center space-x-1.5 text-[11px] font-mono font-bold text-gray-900 uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4 text-[#800D1B]" />
              <span>Pacific Sovereign Desk</span>
            </div>
            <h4 className="font-serif font-bold text-xs text-gray-900 mb-2">
              Central Bank Divergence: Q4 Outlook
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed mb-3">
              Monetary policy trajectories across the Fed, ECB, BOJ, and Bank Indonesia point toward widening rate differentials and foreign exchange term volatility.
            </p>
            <Link
              to="/economy"
              className="text-[11px] font-mono font-bold text-[#800D1B] hover:underline flex items-center"
            >
              <span>Explore Central Bank Monitor</span>
              <ChevronRight className="w-3 h-3 ml-0.5" />
            </Link>
          </div>
        </div>

        {/* COLUMN 2: CENTER */}
        <div className="lg:col-span-6 space-y-6 order-1 lg:order-2">
          {leadArticle && (
            <article className="space-y-3 pb-6 border-b-2 border-gray-200">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="bg-[#800D1B] text-white px-2 py-0.5 font-bold uppercase tracking-wider text-[10px] rounded">
                  {leadArticle.category}
                </span>
                <span className="text-gray-500 text-[11px]">
                  {new Date(leadArticle.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>

              <Link to={`/news/${leadArticle.id}`}>
                <h1 className="font-serif text-2xl sm:text-3xl font-black text-gray-900 hover:text-[#800D1B] transition-colors leading-tight tracking-tight">
                  {leadArticle.headline}
                </h1>
              </Link>

              <div className="relative overflow-hidden rounded-lg border border-gray-200 shadow-xs aspect-video">
                <img
                  src={leadArticle.imageUrl}
                  alt={leadArticle.headline}
                  className="w-full h-full object-cover transform hover:scale-102 transition duration-300"
                />
                <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-xs text-white text-[9px] font-mono px-2 py-0.5 rounded">
                  {leadArticle.source}
                </div>
              </div>

              <p className="text-sm text-gray-700 leading-relaxed">
                {leadArticle.summary}
              </p>

              <div className="flex items-center justify-between text-[11px] font-mono text-gray-500 pt-1">
                <span>By {leadArticle.author}</span>
                <span>{leadArticle.readTime}</span>
              </div>
            </article>
          )}

          {/* Secondary Editorial Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {secondaryArticles.map((article) => (
              <div
                key={article.id}
                className="p-4 rounded-lg bg-white border border-gray-200 space-y-2 flex flex-col justify-between hover:border-gray-300 shadow-2xs transition"
              >
                <div>
                  <div className="text-[10px] font-mono text-[#800D1B] font-bold uppercase tracking-wider mb-1">
                    {article.category}
                  </div>
                  <Link
                    to={`/news/${article.id}`}
                    className="font-serif text-sm font-bold text-gray-900 hover:text-[#800D1B] transition-colors leading-snug line-clamp-2"
                  >
                    {article.headline}
                  </Link>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                    {article.summary}
                  </p>
                </div>
                <div className="pt-2 text-[10px] font-mono text-gray-500 flex items-center justify-between border-t border-gray-100">
                  <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                  <span>{article.readTime}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Technology & Innovation Deep Dive Section */}
          <div className="pt-4 border-t-2 border-gray-900">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-serif font-black text-sm uppercase tracking-wider text-gray-900 flex items-center">
                <Globe className="w-4 h-4 mr-1.5 text-[#800D1B]" />
                Technology & Silicon Infrastructure
              </h3>
              <Link to="/technology" className="text-xs font-mono font-bold text-[#800D1B] hover:underline flex items-center">
                <span>View Tech Desk</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 text-gray-900">
              <span className="text-[10px] font-mono text-[#800D1B] uppercase tracking-wider font-bold">
                SPECIAL REPORT
              </span>
              <h4 className="font-serif font-bold text-base mt-1 mb-2 text-gray-900">
                The Physics of Sub-2nm Lithography: Extreme Ultraviolet (EUV) & Sovereign Chip Fabrication
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed mb-3">
                How High-NA EUV optical systems and glass substrates are reshaping fab margins across TSMC, ASML, and NVIDIA.
              </p>
              <Link
                to="/technology"
                className="inline-flex items-center text-xs font-mono font-bold text-[#800D1B] hover:underline transition"
              >
                <span>Read Full Industry Briefing</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
          </div>
        </div>

        {/* COLUMN 3: RIGHT SIDEBAR */}
        <div className="lg:col-span-3 space-y-6 order-3">
          {/* Markets Snapshot Mini-Table */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-200">
              <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-gray-900 flex items-center">
                <TrendingUp className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                Markets At A Glance
              </h3>
              <Link to="/markets" className="text-[10px] font-mono text-[#800D1B] font-bold hover:underline">
                ALL ASSETS →
              </Link>
            </div>

            <div className="space-y-1.5 divide-y divide-gray-100">
              {quotes.slice(0, 8).map(q => {
                const isUp = q.changePercent !== null && q.changePercent >= 0;
                const isDisconnected = q.price === null || q.status === 'DISCONNECTED';
                return (
                  <div key={q.id} className="pt-1.5 flex items-center justify-between text-xs font-mono">
                    <div>
                      <span className="font-bold text-gray-900 block">
                        {q.id}
                      </span>
                      <span className="text-[10px] text-gray-500 truncate block max-w-[100px]">
                        {q.name.split(' (')[0]}
                      </span>
                    </div>

                    <div className="text-right">
                      {isDisconnected ? (
                        <span className="text-[9px] text-gray-500 font-bold block">
                          FEED STANDBY
                        </span>
                      ) : (
                        <>
                          <span className="font-bold text-gray-900 block">
                            {formatPrice(q.price, q.id)}
                          </span>
                          <span className={`text-[10px] font-bold ${isUp ? 'text-emerald-700' : 'text-rose-700'}`}>
                            {isUp ? '+' : ''}{q.changePercent !== null ? q.changePercent.toFixed(2) : '0.00'}%
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Institutional Research Highlight */}
          {featuredResearch && (
            <div className="bg-gray-50 text-gray-900 p-5 rounded-lg border border-gray-200 shadow-xs relative overflow-hidden">
              <div className="text-[10px] font-mono text-[#800D1B] font-bold uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>PACIFIC RESEARCH</span>
                <span className="bg-[#800D1B] text-white px-1.5 py-0.2 rounded text-[9px]">
                  {featuredResearch.rating}
                </span>
              </div>
              <h4 className="font-serif font-bold text-sm text-gray-900 mb-2 leading-snug">
                {featuredResearch.title}
              </h4>
              <p className="text-xs text-gray-600 line-clamp-3 mb-3">
                {featuredResearch.summary}
              </p>
              <div className="text-[10px] font-mono text-gray-500 mb-3">
                Coverage: {featuredResearch.coverageUniverse.join(', ')}
              </div>
              <Link
                to={`/research/${featuredResearch.id}`}
                className="w-full py-2 bg-[#071426] hover:bg-[#800D1B] text-white font-mono font-bold text-xs uppercase tracking-wider rounded flex items-center justify-center transition shadow-2xs"
              >
                <span>Read Institutional Analysis</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
          )}

          {/* Central Bank Policy Rates */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-xs">
            <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-gray-900 mb-2 flex items-center justify-between border-b border-gray-200 pb-2">
              <span>Central Bank Policy Rates</span>
              <span className="text-[9px] font-mono text-gray-500">BENCHMARK</span>
            </h4>
            <div className="space-y-1.5 font-mono text-xs">
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-600">Fed Funds (US)</span>
                <span className="font-bold text-gray-900">4.50% - 4.75%</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-600">ECB Deposit Rate (EU)</span>
                <span className="font-bold text-gray-900">3.25%</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-600">Bank Indonesia 7DRR</span>
                <span className="font-bold text-gray-900">6.00%</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-600">Bank of Japan (BOJ)</span>
                <span className="font-bold text-gray-900">0.25%</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
