import React from 'react';
import { X, TrendingUp, TrendingDown, Trash2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWatchlist } from '../context/WatchlistContext';
import { useMarket } from '../context/MarketContext';

export default function WatchlistDrawer() {
  const { isOpen, setIsOpen, watchlistTickers, toggleItem } = useWatchlist();
  const { quotes } = useMarket();

  if (!isOpen) return null;

  const watchedQuotes = watchlistTickers.map(t => quotes.find(q => q.id === t) || { id: t, name: t, price: null, changePercent: null });

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white border-l border-gray-200 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <div>
            <h3 className="font-serif font-bold text-base text-gray-900 flex items-center">
              Institutional Watchlist
            </h3>
            <p className="text-[11px] font-mono text-gray-600">
              {watchlistTickers.length} Tracked Instruments • Real-Time Broadcast
            </p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded hover:bg-gray-200 text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Instruments List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-white">
          {watchedQuotes.length === 0 ? (
            <div className="text-center py-16 text-gray-500 text-xs font-mono">
              Your watchlist is currently empty. Click the bookmark icon on any market asset to track it in real time.
            </div>
          ) : (
            watchedQuotes.map(item => {
              const isUp = item.changePercent !== null && item.changePercent >= 0;
              return (
                <div
                  key={item.id}
                  className="p-3 rounded-lg bg-white border border-gray-200 flex items-center justify-between hover:border-gray-300 transition shadow-2xs"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-xs text-gray-900">
                        {item.id}
                      </span>
                      <span className="text-[10px] font-mono bg-gray-100 text-gray-700 px-1.5 py-0.2 rounded border border-gray-200">
                        {item.category || 'ASSET'}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-600 truncate max-w-[180px]">
                      {item.name}
                    </p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="text-right font-mono">
                      <p className="text-xs font-bold text-gray-900">
                        {item.price !== null ? item.price.toLocaleString() : 'N/A'}
                      </p>
                      <p className={`text-[11px] font-bold flex items-center justify-end ${
                        isUp ? 'text-emerald-700' : 'text-rose-700'
                      }`}>
                        {item.changePercent !== null ? (
                          <>
                            {isUp ? <TrendingUp className="w-3 h-3 mr-0.5 inline" /> : <TrendingDown className="w-3 h-3 mr-0.5 inline" />}
                            {isUp ? '+' : ''}{item.changePercent.toFixed(2)}%
                          </>
                        ) : (
                          'DISCONNECTED'
                        )}
                      </p>
                    </div>

                    <button
                      onClick={() => toggleItem(item.id)}
                      title="Remove from Watchlist"
                      className="p-1 text-gray-400 hover:text-rose-600 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <Link
            to="/markets"
            onClick={() => setIsOpen(false)}
            className="w-full py-2.5 px-3 rounded bg-[#071426] hover:bg-[#800D1B] text-white text-xs font-bold font-mono uppercase tracking-wider flex items-center justify-center space-x-1.5 transition shadow-xs"
          >
            <span>Open Dedicated Markets Terminal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
