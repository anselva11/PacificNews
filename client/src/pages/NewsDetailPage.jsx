import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchArticle, fetchNews } from '../services/api';
import { useMarket } from '../context/MarketContext';
import { ArrowLeft, ShieldCheck, ExternalLink } from 'lucide-react';

export default function NewsDetailPage() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const { quotes } = useMarket();

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const res = await fetchArticle(id);
        if (res.data) {
          setArticle(res.data);
          const relRes = await fetchNews({ category: res.data.category, limit: 4 });
          if (relRes.data) {
            setRelated(relRes.data.filter(a => a.id !== id).slice(0, 3));
          }
        }
      } catch (e) {
        console.warn('Error loading article:', e);
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
        RETRIEVING INSTITUTIONAL WIRE RECORD...
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-xl font-bold text-gray-900">Article Not Found</h2>
        <p className="text-xs text-gray-500 font-mono mt-2">The requested wire story does not exist or has been archived.</p>
        <Link to="/" className="inline-block mt-4 text-xs font-mono font-bold text-[#800D1B] underline">
          Return to Wire Home
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-8 bg-white">
      {/* Back button */}
      <Link
        to="/"
        className="inline-flex items-center text-xs font-mono font-bold text-gray-600 hover:text-gray-900 mb-6 transition"
      >
        <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
        BACK TO DISPATCHES
      </Link>

      {/* Meta header */}
      <div className="space-y-3 pb-6 border-b border-gray-200">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <span className="px-2.5 py-0.5 rounded bg-[#800D1B] text-white font-bold uppercase tracking-wider text-[10px]">
            {article.category}
          </span>
          <div className="text-gray-500 flex items-center space-x-3 text-[11px]">
            <span>Published: {new Date(article.publishedAt).toLocaleString()}</span>
            <span>•</span>
            <span>{article.readTime}</span>
          </div>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-black text-gray-900 leading-tight">
          {article.headline}
        </h1>

        <div className="flex items-center justify-between text-xs font-mono text-gray-700 pt-2">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-[#800D1B]" />
            <span className="font-bold text-gray-900">{article.author}</span>
            <span>—</span>
            <span>{article.source}</span>
          </div>
          {article.sourceUrl && (
            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#800D1B] font-bold hover:underline flex items-center"
            >
              <span>Original Wire</span>
              <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          )}
        </div>
      </div>

      {/* Related Tickers strip */}
      {article.relatedTickers && article.relatedTickers.length > 0 && (
        <div className="py-3 border-b border-gray-200 flex items-center space-x-4 overflow-x-auto text-xs font-mono">
          <span className="text-gray-500 text-[11px] font-bold">RELATED INSTRUMENTS:</span>
          {article.relatedTickers.map(t => {
            const q = quotes.find(item => item.id === t);
            return (
              <Link
                key={t}
                to="/markets"
                className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-gray-100 hover:bg-gray-200 transition border border-gray-300"
              >
                <span className="font-bold text-gray-900">{t}</span>
                {q?.price && (
                  <span className="text-gray-600">${q.price.toLocaleString()}</span>
                )}
                {q?.changePercent !== null && (
                  <span className={q.changePercent >= 0 ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}>
                    {q.changePercent >= 0 ? '+' : ''}{q.changePercent}%
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}

      {/* Hero Image */}
      {article.imageUrl && (
        <div className="my-6 rounded-lg overflow-hidden border border-gray-200 shadow-xs aspect-video">
          <img
            src={article.imageUrl}
            alt={article.headline}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Article Body */}
      <div className="prose max-w-none text-gray-800 font-sans leading-relaxed space-y-4 text-base">
        {article.content.split('\n\n').map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>

      {/* Editorial Attribution Box */}
      <div className="mt-12 p-4 rounded-lg bg-gray-50 border border-gray-200 text-xs font-mono text-gray-600 space-y-1">
        <p className="font-bold text-gray-900">EDITORIAL STANDARDS & VERIFICATION</p>
        <p>This report has been vetted by the Pacific Capital News Editorial Bureau in accordance with institutional market reporting integrity standards. No simulated quotes or automated hallucinations are permitted.</p>
      </div>

      {/* Related Stories */}
      {related.length > 0 && (
        <div className="mt-12 pt-6 border-t-2 border-gray-900">
          <h3 className="font-serif font-black text-sm uppercase tracking-wider text-gray-900 mb-4">
            Related Intelligence
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {related.map(r => (
              <Link
                key={r.id}
                to={`/news/${r.id}`}
                className="p-4 rounded-lg bg-white border border-gray-200 hover:border-gray-300 transition space-y-1 block shadow-2xs"
              >
                <span className="text-[10px] font-mono text-[#800D1B] font-bold uppercase">
                  {r.category}
                </span>
                <h4 className="font-serif text-xs font-bold text-gray-900 line-clamp-2">
                  {r.headline}
                </h4>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
