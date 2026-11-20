import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchNews } from '../services/api';
import { useMarket } from '../context/MarketContext';
import { Layers } from 'lucide-react';

export default function CategoryPage({ categoryName, categoryDescription, assetCategory }) {
  const [articles, setArticles] = useState([]);
  const { quotes } = useMarket();

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchNews({ category: categoryName === 'Economy' ? 'Global Economy' : categoryName });
        if (res.data) setArticles(res.data);
      } catch (e) {
        console.warn('Error loading category news:', e);
      }
    }
    load();
    window.scrollTo(0, 0);
  }, [categoryName]);

  const relatedQuotes = assetCategory ? quotes.filter(q => q.category === assetCategory) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 bg-white">
      {/* Header */}
      <div className="pb-4 border-b border-gray-200">
        <div className="flex items-center space-x-2 text-xs font-mono text-[#800D1B] font-bold uppercase tracking-wider mb-1">
          <Layers className="w-4 h-4" />
          <span>Pacific Capital Editorial Desk</span>
        </div>
        <h1 className="font-serif text-3xl font-black text-gray-900 uppercase tracking-tight">
          {categoryName}
        </h1>
        <p className="text-xs text-gray-600 font-mono mt-1">
          {categoryDescription}
        </p>
      </div>

      {/* Relevant Asset Ticker Strip */}
      {relatedQuotes.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
          {relatedQuotes.map(q => {
            const isUp = q.changePercent !== null && q.changePercent >= 0;
            return (
              <div key={q.id} className="p-3 rounded-lg bg-gray-50 border border-gray-200 font-mono">
                <span className="text-[10px] text-gray-500 block font-bold">{q.name}</span>
                <span className="text-sm font-black text-gray-900 block mt-0.5">
                  {q.price !== null ? q.price.toLocaleString() : 'N/A'}
                </span>
                <span className={`text-[10px] font-bold flex items-center mt-0.5 ${isUp ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {isUp ? '+' : ''}{q.changePercent !== null ? q.changePercent.toFixed(2) : '0.00'}%
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.length === 0 ? (
          <div className="col-span-3 py-16 text-center text-gray-500 font-mono text-xs">
            No published dispatches under {categoryName} currently matching active filters.
          </div>
        ) : (
          articles.map(article => (
            <div
              key={article.id}
              className="p-5 rounded-lg bg-white border border-gray-200 hover:border-gray-300 shadow-xs flex flex-col justify-between transition group"
            >
              <div>
                {article.imageUrl && (
                  <div className="rounded overflow-hidden mb-3 aspect-video border border-gray-200">
                    <img src={article.imageUrl} alt={article.headline} className="w-full h-full object-cover group-hover:scale-102 transition duration-200" />
                  </div>
                )}
                <div className="text-[10px] font-mono text-[#800D1B] font-bold uppercase mb-1">
                  {article.category}
                </div>
                <Link to={`/news/${article.id}`}>
                  <h3 className="font-serif font-bold text-base text-gray-900 group-hover:text-[#800D1B] transition leading-snug mb-2">
                    {article.headline}
                  </h3>
                </Link>
                <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed mb-4">
                  {article.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-mono text-gray-500">
                <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                <span>{article.readTime}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
