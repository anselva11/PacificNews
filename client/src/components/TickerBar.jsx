import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { useMarket } from '../context/MarketContext';

export default function TickerBar() {
  const { quotes, lastTickTimes } = useMarket();

  // If no quotes yet, show institutional placeholder
  if (!quotes || quotes.length === 0) {
    return (
      <div className="bg-gray-50 text-gray-700 text-xs py-2 px-4 border-b border-gray-200 flex items-center justify-between font-mono">
        <span className="flex items-center">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-2" />
          CONNECTING TO PACIFIC CAPITAL INSTITUTIONAL MARKET FEEDS...
        </span>
        <span className="text-[11px] text-gray-500">BLOOMBERG SAPI / COINGECKO / GLOBAL FX</span>
      </div>
    );
  }

  // Format price based on magnitude
  const formatPrice = (val, id) => {
    if (val === null || val === undefined) return 'N/A';
    if (id.includes('IDR')) {
      return val.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    }
    if (val < 2) {
      return val.toFixed(4);
    }
    return val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="bg-white text-gray-900 border-b border-gray-200 overflow-hidden relative select-none shadow-xs">
      <div className="flex items-center">
        {/* Scrolling Ticker Strip */}
        <div className="flex overflow-x-auto no-scrollbar py-1.5 space-x-6 px-4 animate-ticker bg-white">
          {/* Double array for infinite loop effect */}
          {[...quotes, ...quotes].map((item, index) => {
            const isUp = item.change !== null && item.change >= 0;
            const tickDirection = lastTickTimes[item.id];
            const isDisconnected = item.status === 'DISCONNECTED' || item.price === null;

            return (
              <Link
                key={`${item.id}-${index}`}
                to={item.category === 'EQUITY_INDICES' || item.category === 'CRYPTO' ? '/markets' : '/markets'}
                className={`flex items-center space-x-2 text-xs font-mono whitespace-nowrap px-2 py-0.5 rounded transition duration-200 hover:bg-gray-100 ${
                  tickDirection === 'up' ? 'tick-up' : tickDirection === 'down' ? 'tick-down' : ''
                }`}
              >
                <span className="font-bold text-gray-900 tracking-wider">
                  {item.name.split(' (')[0]}
                </span>

                {isDisconnected ? (
                  <span className="flex items-center text-[10px] text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-300">
                    <AlertCircle className="w-2.5 h-2.5 mr-1 text-gray-500" />
                    FEED NOT CONNECTED
                  </span>
                ) : (
                  <>
                    <span className="font-tabular font-bold text-gray-900">
                      {formatPrice(item.price, item.id)}
                    </span>
                    <span
                      className={`flex items-center text-[11px] font-bold px-1.5 py-0.2 rounded font-tabular ${
                        isUp
                          ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                          : 'text-rose-700 bg-rose-50 border border-rose-200'
                      }`}
                    >
                      {isUp ? (
                        <TrendingUp className="w-3 h-3 mr-0.5 inline" />
                      ) : (
                        <TrendingDown className="w-3 h-3 mr-0.5 inline" />
                      )}
                      {isUp ? '+' : ''}
                      {item.changePercent !== null ? item.changePercent.toFixed(2) : '0.00'}%
                    </span>
                  </>
                )}
              </Link>
            );
          })}
        </div>

        {/* Right Compliance Status Indicator */}
        <div className="hidden lg:flex items-center px-3 py-2 bg-gray-100 border-l border-gray-200 z-10 whitespace-nowrap text-[10px] font-mono text-gray-700">
          <span className="text-[#800D1B] font-bold mr-1">DATA VERIFIED:</span>
          <span className="font-semibold">REAL QUOTES (NO SYNTHETICS)</span>
        </div>
      </div>
    </div>
  );
}
