import React from 'react';
import { Link } from 'react-router-dom';
import logoHolding from '../assets/logo holding.png';

export default function Footer() {
  return (
    <footer className="bg-white text-gray-700 border-t border-gray-200 mt-16 transition-colors duration-200">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center">
              <img
                src={logoHolding}
                alt="Pacific Investment Capital Holdings"
                className="h-12 w-auto object-contain"
              />
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Global financial journalism, institutional equity analysis, and macroeconomic intelligence.
            </p>
            <div className="text-[11px] font-mono text-gray-700 space-y-0.5">
              <p className="font-bold text-gray-900">PACIFIC INVESTMENT CAPITAL HOLDINGS</p>
              <p className="text-gray-500">Singapore • New York • London • Jakarta • Tokyo</p>
            </div>
          </div>

          {/* Editorial & Coverage */}
          <div>
            <h4 className="font-mono text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
              Editorial Coverage
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li><Link to="/markets" className="text-gray-600 hover:text-[#800D1B] transition font-medium">Global Stock Markets</Link></li>
              <li><Link to="/economy" className="text-gray-600 hover:text-[#800D1B] transition font-medium">Central Banks & Monetary Policy</Link></li>
              <li><Link to="/commodities" className="text-gray-600 hover:text-[#800D1B] transition font-medium">Energy & Precious Metals</Link></li>
              <li><Link to="/currencies" className="text-gray-600 hover:text-[#800D1B] transition font-medium">Foreign Exchange & Cross Rates</Link></li>
              <li><Link to="/technology" className="text-gray-600 hover:text-[#800D1B] transition font-medium">Semiconductors & AI Infrastructure</Link></li>
              <li><Link to="/crypto" className="text-gray-600 hover:text-[#800D1B] transition font-medium">Digital Assets & Sovereign Allocations</Link></li>
            </ul>
          </div>

          {/* Institutional Intelligence */}
          <div>
            <h4 className="font-mono text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
              Intelligence & Tools
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li><Link to="/research" className="text-gray-600 hover:text-[#800D1B] transition font-medium">Institutional Equity Research</Link></li>
              <li><Link to="/research" className="text-gray-600 hover:text-[#800D1B] transition font-medium">Macroeconomic Outlook (2026-2030)</Link></li>
              <li><Link to="/calendar" className="text-gray-600 hover:text-[#800D1B] transition font-medium">Global Economic Calendar</Link></li>
              <li><Link to="/companies" className="text-gray-600 hover:text-[#800D1B] transition font-medium">Global Company Profiles</Link></li>
            </ul>
          </div>

          {/* Compliance & Standards */}
          <div>
            <h4 className="font-mono text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
              Institutional Governance
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li><a href="#disclaimer" className="text-gray-600 hover:text-[#800D1B] transition font-medium">Financial Market Data Disclaimer</a></li>
              <li><a href="#editorial-policy" className="text-gray-600 hover:text-[#800D1B] transition font-medium">Editorial Independence Policy</a></li>
              <li><a href="#terms" className="text-gray-600 hover:text-[#800D1B] transition font-medium">Terms of Service</a></li>
              <li><a href="#privacy" className="text-gray-600 hover:text-[#800D1B] transition font-medium">Institutional Privacy Notice</a></li>
              <li><a href="#bloomberg" className="text-gray-600 hover:text-[#800D1B] transition font-medium">Bloomberg Data License Agreement</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Strict Financial Disclaimers per Project Specification */}
      <div id="disclaimer" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-[11px] text-gray-600 space-y-3 font-sans">
        <p>
          <strong className="text-gray-900">MARKET DATA INTEGRITY & BLOOMBERG DISCLOSURE:</strong> Market quotes, indices, currency cross rates, commodity benchmarks, and financial statistics displayed across Pacific Capital News are sourced from authorized institutional feeds, including Bloomberg Data License (DL), Bloomberg Server API (SAPI), CoinGecko, and global financial exchange aggregators. Bloomberg is a registered trademark of Bloomberg Finance L.P. and its affiliates. Pacific Capital News operates under strict journalistic and compliance mandates: no simulated or fabricated financial data is ever generated. When live data feed credentials or licensed gateways are disconnected or undergoing scheduled maintenance, the platform visibly states "LIVE DATA FEED NOT CONNECTED" in lieu of placeholder estimates.
        </p>
        <p>
          <strong className="text-gray-900">INVESTMENT ADVICE DISCLAIMER:</strong> Content published by Pacific Capital News is prepared solely for informational, journalistic, and market intelligence purposes. Nothing contained herein constitutes institutional investment advice, portfolio recommendation, or an offer to buy or sell securities. Historical performance is not indicative of future market returns.
        </p>
      </div>

      {/* Copyright */}
      <div className="bg-gray-50 py-4 border-t border-gray-200 text-center text-xs text-gray-600 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between">
          <p>© 2026 PACIFIC INVESTMENT CAPITAL HOLDINGS. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 text-[10px] text-gray-500">
            PACIFIC TERMINAL ENGINE v1.0.4 • HIGH DATA DENSITY ARCHITECTURE
          </p>
        </div>
      </div>
    </footer>
  );
}
