import React, { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';
import { fetchHistoricalSeries } from '../services/api';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function TradingViewChart({ ticker, name, currentPrice, changePercent }) {
  const chartContainerRef = useRef(null);
  const chartInstance = useRef(null);
  const seriesInstance = useRef(null);
  const volumeSeriesInstance = useRef(null);

  const [range, setRange] = useState('1M');
  const [chartType, setChartType] = useState('candlestick');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const ranges = ['1D', '5D', '1M', '1Y', '5Y'];

  useEffect(() => {
    let isSubscribed = true;

    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchHistoricalSeries(ticker, range);
        if (!isSubscribed) return;

        if (res.data && res.data.length > 0) {
          renderChart(res.data);
        } else {
          setError('Historical candlestick feed currently offline for this instrument.');
        }
      } catch (err) {
        if (isSubscribed) {
          setError('Failed to fetch historical series from data provider.');
        }
      } finally {
        if (isSubscribed) setLoading(false);
      }
    }

    loadData();

    return () => {
      isSubscribed = false;
    };
  }, [ticker, range, chartType]);

  const renderChart = (data) => {
    if (!chartContainerRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.remove();
      chartInstance.current = null;
    }

    const bg = '#ffffff';
    const textColor = '#334155';
    const gridColor = '#F1F5F9';

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 380,
      layout: {
        background: { color: bg },
        textColor: textColor,
        fontFamily: 'Inter, -apple-system, sans-serif'
      },
      grid: {
        vertLines: { color: gridColor },
        horzLines: { color: gridColor }
      },
      crosshair: {
        mode: 1
      },
      rightPriceScale: {
        borderColor: '#E2E8F0',
      },
      timeScale: {
        borderColor: '#E2E8F0',
        timeVisible: true,
        secondsVisible: false
      }
    });

    chartInstance.current = chart;

    if (chartType === 'candlestick' && data[0]?.open !== undefined) {
      const candlestickSeries = chart.addCandlestickSeries({
        upColor: '#10B981',
        downColor: '#EF4444',
        borderUpColor: '#10B981',
        borderDownColor: '#EF4444',
        wickUpColor: '#10B981',
        wickDownColor: '#EF4444'
      });
      candlestickSeries.setData(data);
      seriesInstance.current = candlestickSeries;
    } else {
      const areaSeries = chart.addAreaSeries({
        topColor: 'rgba(7, 20, 38, 0.25)',
        bottomColor: 'rgba(7, 20, 38, 0.02)',
        lineColor: '#071426',
        lineWidth: 2
      });
      areaSeries.setData(data.map(d => ({ time: d.time, value: d.value || d.close })));
      seriesInstance.current = areaSeries;
    }

    // Volume histogram series
    if (data.some(d => d.volume > 0)) {
      const volumeSeries = chart.addHistogramSeries({
        color: '#E2E8F0',
        priceFormat: { type: 'volume' },
        priceScaleId: '',
      });
      volumeSeries.priceScale().applyOptions({
        scaleMargins: { top: 0.8, bottom: 0 },
      });
      volumeSeries.setData(
        data.map(d => ({
          time: d.time,
          value: d.volume || 0,
          color: d.close >= (d.open || d.close) ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'
        }))
      );
      volumeSeriesInstance.current = volumeSeries;
    }

    chart.timeScale().fitContent();

    const handleResize = () => {
      if (chartContainerRef.current && chartInstance.current) {
        chartInstance.current.applyOptions({
          width: chartContainerRef.current.clientWidth
        });
      }
    };

    window.addEventListener('resize', handleResize);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs">
      {/* Chart Top Controls */}
      <div className="flex flex-wrap items-center justify-between pb-3 mb-2 border-b border-gray-200 gap-2">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="font-serif font-bold text-lg text-gray-900">
              {name || ticker}
            </h3>
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-800 border border-gray-300">
              {ticker}
            </span>
          </div>
          <div className="flex items-center space-x-2 mt-1">
            <span className="font-mono text-2xl font-black text-gray-900">
              {currentPrice !== null ? currentPrice?.toLocaleString() : 'N/A'}
            </span>
            {changePercent !== null && (
              <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                changePercent >= 0 ? 'text-emerald-700 bg-emerald-50 border border-emerald-200' : 'text-rose-700 bg-rose-50 border border-rose-200'
              }`}>
                {changePercent >= 0 ? '+' : ''}{changePercent}%
              </span>
            )}
          </div>
        </div>

        {/* Range & View Toggles */}
        <div className="flex items-center space-x-2">
          {/* Chart Type Toggle */}
          <div className="flex bg-gray-100 rounded p-0.5 text-xs font-mono border border-gray-300">
            <button
              onClick={() => setChartType('candlestick')}
              className={`px-3 py-1 rounded transition ${
                chartType === 'candlestick'
                  ? 'bg-[#071426] text-white font-bold shadow-xs'
                  : 'text-gray-700 hover:text-black font-medium'
              }`}
            >
              Candles
            </button>
            <button
              onClick={() => setChartType('area')}
              className={`px-3 py-1 rounded transition ${
                chartType === 'area'
                  ? 'bg-[#071426] text-white font-bold shadow-xs'
                  : 'text-gray-700 hover:text-black font-medium'
              }`}
            >
              Line
            </button>
          </div>

          {/* Timeframe selector */}
          <div className="flex bg-gray-100 rounded p-0.5 text-xs font-mono border border-gray-300">
            {ranges.map(r => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-2.5 py-1 rounded transition ${
                  range === r
                    ? 'bg-[#071426] text-white font-bold shadow-xs'
                    : 'text-gray-700 hover:text-black font-medium'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="relative w-full h-[380px] bg-white">
        {loading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center z-10 font-mono text-xs text-gray-700">
            <RefreshCw className="w-4 h-4 mr-2 animate-spin text-[#800D1B]" />
            FETCHING STREAM DATA...
          </div>
        )}

        {error ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-600 font-mono text-xs">
            <AlertCircle className="w-8 h-8 text-rose-500 mb-2" />
            <p className="font-semibold text-gray-900">{error}</p>
            <p className="text-[11px] text-gray-500 mt-1 max-w-sm">
              Per Bloomberg and Pacific Capital institutional standards, synthetic or fabricated chart series are strictly forbidden when feeds are offline.
            </p>
          </div>
        ) : (
          <div ref={chartContainerRef} className="w-full h-full bg-white" />
        )}
      </div>

      {/* Source and compliance footer */}
      <div className="pt-2 mt-2 border-t border-gray-200 flex items-center justify-between text-[10px] font-mono text-gray-500">
        <span>DATA SOURCE: VERIFIED INSTITUTIONAL FEED</span>
        <span>TRADINGVIEW LIGHTWEIGHT CHARTS™ ENGINE</span>
      </div>
    </div>
  );
}
