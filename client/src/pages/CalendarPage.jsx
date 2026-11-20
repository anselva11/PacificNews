import React, { useState, useEffect } from 'react';
import { fetchCalendar } from '../services/api';
import { Calendar as CalendarIcon } from 'lucide-react';

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [countryFilter, setCountryFilter] = useState('ALL');
  const [importanceFilter, setImportanceFilter] = useState('ALL');

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchCalendar({ country: countryFilter, importance: importanceFilter });
        if (res.data) setEvents(res.data);
      } catch (e) {
        console.warn('Error loading calendar:', e);
      }
    }
    load();
  }, [countryFilter, importanceFilter]);

  const countries = [
    { code: 'ALL', name: 'Global (All G20)' },
    { code: 'US', name: 'United States' },
    { code: 'EU', name: 'Eurozone' },
    { code: 'JP', name: 'Japan' },
    { code: 'ID', name: 'Indonesia' },
    { code: 'CN', name: 'China' },
    { code: 'GB', name: 'United Kingdom' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 bg-white">
      {/* Header */}
      <div className="pb-4 border-b border-gray-200">
        <div className="flex items-center space-x-2 text-xs font-mono text-[#800D1B] font-bold uppercase tracking-wider mb-1">
          <CalendarIcon className="w-4 h-4" />
          <span>Macroeconomic Release Schedule</span>
        </div>
        <h1 className="font-serif text-3xl font-black text-gray-900">
          Global Economic Calendar
        </h1>
        <p className="text-xs text-gray-600 font-mono mt-1">
          Verified central bank rate decisions, CPI/inflation releases, employment payrolls, and GDP prints.
        </p>
      </div>

      {/* Compliance Box */}
      <div className="p-3.5 rounded bg-gray-50 border border-gray-200 text-xs font-mono text-gray-700 flex items-center justify-between">
        <span>DATA INTEGRITY MANDATE: Verified official central bank & statistical bureau releases only.</span>
        <span className="text-[#800D1B] font-bold">ALL TIMESTAMPS IN UTC</span>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-3 rounded-lg border border-gray-200 shadow-2xs">
        {/* Country Selector */}
        <div className="flex items-center space-x-2 overflow-x-auto">
          <span className="text-xs font-mono text-gray-500 font-bold">JURISDICTION:</span>
          {countries.map(c => (
            <button
              key={c.code}
              onClick={() => setCountryFilter(c.code)}
              className={`px-2.5 py-1 rounded text-xs font-mono transition ${
                countryFilter === c.code
                  ? 'bg-[#071426] text-white font-bold'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Importance */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono text-gray-500 font-bold">IMPACT:</span>
          {['ALL', 'HIGH', 'MEDIUM'].map(imp => (
            <button
              key={imp}
              onClick={() => setImportanceFilter(imp)}
              className={`px-2.5 py-1 rounded text-xs font-mono font-bold ${
                importanceFilter === imp
                  ? 'bg-[#800D1B] text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {imp}
            </button>
          ))}
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-xs">
        <table className="w-full text-left font-mono text-xs">
          <thead>
            <tr className="bg-gray-50 text-[10px] text-gray-700 uppercase tracking-wider border-b border-gray-200">
              <th className="py-3 px-4 font-bold">Date & Time</th>
              <th className="py-3 px-4 font-bold">Country</th>
              <th className="py-3 px-4 font-bold">Economic Event</th>
              <th className="py-3 px-4 text-center font-bold">Impact</th>
              <th className="py-3 px-4 text-right font-bold">Actual</th>
              <th className="py-3 px-4 text-right font-bold">Consensus Forecast</th>
              <th className="py-3 px-4 text-right font-bold">Previous</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {events.map((e) => (
              <tr key={e.id} className="hover:bg-gray-50 transition">
                <td className="py-3 px-4 font-bold text-gray-900">
                  {e.date} <span className="text-gray-500 block text-[10px]">{e.time}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="font-bold text-gray-900">{e.countryCode}</span>
                  <span className="text-gray-500 block text-[10px]">{e.country}</span>
                </td>
                <td className="py-3 px-4 font-serif font-bold text-sm text-gray-900">
                  {e.event}
                </td>
                <td className="py-3 px-4 text-center">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                    e.importance === 'HIGH'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-gray-100 text-gray-700 border border-gray-200'
                  }`}>
                    {e.importance}
                  </span>
                </td>
                <td className="py-3 px-4 text-right font-bold text-gray-900">
                  {e.actual !== null ? e.actual : <span className="text-gray-400 font-normal">Pending</span>}
                </td>
                <td className="py-3 px-4 text-right text-gray-700">
                  {e.forecast}
                </td>
                <td className="py-3 px-4 text-right text-gray-500">
                  {e.previous}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
