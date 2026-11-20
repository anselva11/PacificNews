import React, { useState } from 'react';
import { useMarket } from '../context/MarketContext';
import { useWatchlist } from '../context/WatchlistContext';
import TradingViewChart from '../components/TradingViewChart';
import { TrendingUp, TrendingDown, Bookmark, BookmarkCheck, Layers, Info } from 'lucide-react';

export default function MarketsPage() {
  const { quotes, bloombergStatus, wsConnected, lastTickTimes } = useMarket();
  const { isInWatchlist, toggleItem } = useWatchlist();

  const [activeTab, setActiveTab] = useState('ALL');
  const [selectedTicker, setSelectedTicker] = useState('SPX');

  const categories = [
    { id: 'ALL', name: 'All Instruments' },
    { id: 'EQUITY_INDICES', name: 'Equity Indices' },
    { id: 'FOREX', name: 'Foreign Exchange' },
    { id: 'COMMODITIES', name: 'Commodities' },
    { id: 'CRYPTO', name: 'Digital Assets' }
  ];

  const filteredQuotes = activeTab === 'ALL'
    ? quotes
    : quotes.filter(q => q.category === activeTab);

  const activeInstrument = quotes.find(q => q.id === selectedTicker) || quotes[0] || {
    id: 'SPX',
    name: 'S&P 500',
    price: null,
    changePercent: null
  };

  const formatPrice = (val, id) => {
    if (val === null || val === undefined) return 'N/A';
    if (id?.includes('IDR')) return val.toLocaleString('en-US', { maximumFractionDigits: 0 });
    return val < 2 ? val.toFixed(4) : val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 bg-white">
      {/* Header & Bloomberg Integration Status Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-gray-200 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#800D1B] font-bold uppercase tracking-wider mb-1">
            <Layers className="w-3.5 h-3.5" />
            <span>Institutional Multi-Asset Terminal</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-black text-gray-900">
            Live Financial Market Dashboard
          </h1>
          <p className="text-xs text-gray-600 font-mono mt-1">
            Real-time equity indices, currency crosses, commodity futures, and digital assets. Verified data providers only.
          </p>
        </div>

        {/* Live Bloomberg / Data Engine Badge */}
        <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-xs font-mono space-y-1">
          <div className="flex items-center justify-between space-x-3">
            <span className="text-gray-500 font-semibold">FEED ENGINE:</span>
            <span className={`font-bold flex items-center ${wsConnected ? 'text-emerald-700' : 'text-gray-600'}`}>
              <span className={`w-2 h-2 rounded-full mr-1.5 ${wsConnected ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`} />
              {wsConnected ? 'STREAM CONNECTED' : 'INITIALIZING'}
            </span>
          </div>
          <div className="flex items-center justify-between space-x-3">
            <span className="text-gray-500 font-semibold">BLOOMBERG DL:</span>
            <span className="text-gray-900 font-bold">
              {bloombergStatus?.connected ? 'LICENSED (ACTIVE)' : 'STANDBY (AWAITING DL TOKEN)'}
            </span>
          </div>
        </div>
      </div>

      {/* Bloomberg Data License Compliance Notice */}
      <div className="bg-gray-50 border-l-4 border-[#800D1B] border-t border-r border-b border-gray-200 p-3.5 rounded text-xs font-mono flex items-start space-x-3 text-gray-800">
        <Info className="w-4 h-4 shrink-0 mt-0.5 text-[#800D1B]" />
        <div>
          <strong className="font-bold text-gray-900">VERIFIABLE FINANCIAL DATA GUARANTEE:</strong> All figures shown below are pulled exclusively from authenticated live market endpoints (CoinGecko Real-Time API, European Central Bank FX, Global Exchange Network). Per strict institutional standards, <span className="underline font-bold">no simulated or random prices are ever generated</span>. When a provider feed is unreachable or uncredentialed, it displays "LIVE DATA FEED NOT CONNECTED".
        </div>
      </div>

      {/* Interactive TradingView Chart Section */}
      <div className="grid grid-cols-1 gap-6">
        <TradingViewChart
          ticker={activeInstrument.id}
          name={activeInstrument.name}
          currentPrice={activeInstrument.price}
          changePercent={activeInstrument.changePercent}
        />
      </div>

      {/* Category Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-gray-200 overflow-x-auto pb-1">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.id)}
            className={`px-3 py-2 text-xs font-mono font-bold rounded-t uppercase tracking-wider transition ${
              activeTab === cat.id
                ? 'bg-[#071426] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            {cat.name} ({activeTab === cat.id ? filteredQuotes.length : quotes.filter(q => cat.id === 'ALL' ? true : q.category === cat.id).length})
          </button>
        ))}
      </div>

      {/* Dedicated Comprehensive Market Instruments Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-[11px] font-mono text-gray-700 uppercase tracking-wider border-b border-gray-200">
                <th className="py-3 px-4 font-bold">Instrument</th>
                <th className="py-3 px-4 font-bold">Asset Class</th>
                <th className="py-3 px-4 text-right font-bold">Last Price</th>
                <th className="py-3 px-4 text-right font-bold">Net Change</th>
                <th className="py-3 px-4 text-right font-bold">% Change</th>
                <th className="py-3 px-4 text-right font-bold">Day High</th>
                <th className="py-3 px-4 text-right font-bold">Day Low</th>
                <th className="py-3 px-4 text-right font-bold">24h Volume</th>
                <th className="py-3 px-4 font-bold">Data Source</th>
                <th className="py-3 px-4 text-center font-bold">Track</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-xs font-mono">
              {filteredQuotes.map((item) => {
                const isUp = item.change !== null && item.change >= 0;
                const isSelected = item.id === selectedTicker;
                const isDisconnected = item.status === 'DISCONNECTED' || item.price === null;
                const tickClass = lastTickTimes[item.id] === 'up' ? 'tick-up' : lastTickTimes[item.id] === 'down' ? 'tick-down' : '';

                return (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedTicker(item.id)}
                    className={`cursor-pointer transition-colors duration-150 ${tickClass} ${
                      isSelected
                        ? 'bg-blue-50/60'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {/* Instrument name & ticker */}
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-gray-900">
                          {item.id}
                        </span>
                        {isSelected && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#071426] text-white">
                            ACTIVE CHART
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-gray-600 block truncate max-w-[200px]">
                        {item.name}
                      </span>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 text-gray-600 uppercase text-[10px]">
                      {item.category.replace('_', ' ')}
                    </td>

                    {/* Last Price */}
                    <td className="py-3 px-4 text-right font-bold text-gray-900 font-tabular">
                      {isDisconnected ? (
                        <span className="text-gray-400 font-normal">N/A</span>
                      ) : (
                        formatPrice(item.price, item.id)
                      )}
                    </td>

                    {/* Net Change */}
                    <td className="py-3 px-4 text-right font-tabular">
                      {isDisconnected ? (
                        <span className="text-gray-400">-</span>
                      ) : (
                        <span className={`font-bold ${isUp ? 'text-emerald-700' : 'text-rose-700'}`}>
                          {isUp ? '+' : ''}{item.change !== null ? item.change.toFixed(2) : '-'}
                        </span>
                      )}
                    </td>

                    {/* % Change */}
                    <td className="py-3 px-4 text-right font-tabular">
                      {isDisconnected ? (
                        <span className="text-gray-500 font-bold bg-gray-100 px-1.5 py-0.5 rounded text-[10px] border border-gray-300">
                          FEED OFFLINE
                        </span>
                      ) : (
                        <span className={`inline-flex items-center font-bold px-1.5 py-0.5 rounded text-[11px] ${
                          isUp
                            ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                            : 'text-rose-700 bg-rose-50 border border-rose-200'
                        }`}>
                          {isUp ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                          {isUp ? '+' : ''}{item.changePercent !== null ? item.changePercent.toFixed(2) : '0.00'}%
                        </span>
                      )}
                    </td>

                    {/* High */}
                    <td className="py-3 px-4 text-right text-gray-700 font-tabular">
                      {item.high !== null ? formatPrice(item.high, item.id) : '-'}
                    </td>

                    {/* Low */}
                    <td className="py-3 px-4 text-right text-gray-700 font-tabular">
                      {item.low !== null ? formatPrice(item.low, item.id) : '-'}
                    </td>

                    {/* 24h Volume */}
                    <td className="py-3 px-4 text-right text-gray-700 font-tabular">
                      {item.volume ? Number(item.volume).toLocaleString() : 'N/A'}
                    </td>

                    {/* Attribution */}
                    <td className="py-3 px-4 text-[10px] text-gray-500">
                      {item.source}
                    </td>

                    {/* Watchlist Bookmark */}
                    <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => toggleItem(item.id)}
                        className="p-1 rounded text-gray-400 hover:text-[#800D1B] transition"
                        title={isInWatchlist(item.id) ? 'Remove from Watchlist' : 'Add to Watchlist'}
                      >
                        {isInWatchlist(item.id) ? (
                          <BookmarkCheck className="w-4 h-4 text-[#800D1B]" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
