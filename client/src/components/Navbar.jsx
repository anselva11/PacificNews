import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Bookmark, ShieldCheck, Menu, X, Globe } from 'lucide-react';
import { useMarket } from '../context/MarketContext';
import { useWatchlist } from '../context/WatchlistContext';
import logoHolding from '../assets/logo holding.png';

export default function Navbar({ onOpenSearch }) {
  const { marketTimes, wsConnected, bloombergStatus } = useMarket();
  const { watchlistTickers, setIsOpen } = useWatchlist();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Markets', path: '/markets' },
    { name: 'Economy', path: '/economy' },
    { name: 'Companies', path: '/companies' },
    { name: 'Technology', path: '/technology' },
    { name: 'Commodities', path: '/commodities' },
    { name: 'Currencies', path: '/currencies' },
    { name: 'Crypto', path: '/crypto' },
    { name: 'Opinion', path: '/opinion' },
    { name: 'Research', path: '/research' },
    { name: 'Calendar', path: '/calendar' },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-xs">
      {/* Top Institutional Financial Centers Bar */}
      <div className="bg-gray-50 text-gray-700 text-[11px] font-mono px-4 py-1.5 flex flex-wrap items-center justify-between border-b border-gray-200">
        <div className="flex items-center space-x-6 overflow-x-auto py-0.5">
          <span className="flex items-center text-gray-900 font-bold">
            <Globe className="w-3.5 h-3.5 mr-1 text-[#800D1B]" />
            FINANCIAL HUBS:
          </span>
          <span className="flex items-center">
            <span className="text-gray-500 font-semibold mr-1">NYC</span>
            <span className="text-gray-900 font-bold">{marketTimes.est || '12:00:00'}</span>
          </span>
          <span className="flex items-center">
            <span className="text-gray-500 font-semibold mr-1">LON</span>
            <span className="text-gray-900 font-bold">{marketTimes.lon || '17:00:00'}</span>
          </span>
          <span className="flex items-center">
            <span className="text-gray-500 font-semibold mr-1">TYO</span>
            <span className="text-gray-900 font-bold">{marketTimes.tyo || '02:00:00'}</span>
          </span>
          <span className="flex items-center">
            <span className="text-gray-500 font-semibold mr-1">JKT</span>
            <span className="text-gray-900 font-bold">{marketTimes.jkt || '00:00:00'}</span>
          </span>
          <span className="flex items-center">
            <span className="text-[#800D1B] font-bold mr-1">UTC</span>
            <span className="text-gray-900 font-bold">{marketTimes.utc || '17:00:00'}</span>
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-mono font-bold">
            <span className={`w-2 h-2 rounded-full mr-1.5 ${wsConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <span>{wsConnected ? 'LIVE FEED CONNECTED' : 'RECONNECTING'}</span>
          </div>

          <div className="hidden md:flex items-center text-[10px] bg-gray-100 text-gray-800 px-2 py-0.5 rounded border border-gray-300 font-mono font-bold">
            <span>{bloombergStatus?.connected ? 'BLOOMBERG DL: VERIFIED' : 'BLOOMBERG SAPI: STANDBY'}</span>
          </div>
        </div>
      </div>

      {/* Main Header Brand Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-3 group">
            {/* Transparent Logo */}
            <div className="flex items-center">
              <img
                src={logoHolding}
                alt="Pacific Investment Capital Holdings"
                className="h-10 sm:h-12 w-auto object-contain transition duration-200"
              />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-serif text-xl sm:text-2xl font-black tracking-tight text-gray-900 uppercase">
                  Pacific Capital <span className="text-[#800D1B]">News</span>
                </span>
              </div>
              <div className="text-[9px] uppercase tracking-widest text-gray-600 font-semibold flex items-center">
                <span>Pacific Investment Capital Holdings</span>
                <span className="mx-1.5">•</span>
                <span className="text-[#800D1B] font-bold">See Beyond The Market</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Quick Search */}
          <button
            onClick={onOpenSearch}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium border border-gray-300 transition"
            title="Search Market Intelligence (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search...</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-mono bg-white border border-gray-300 rounded text-gray-600">
              ⌘K
            </kbd>
          </button>

          {/* Watchlist Toggle */}
          <button
            onClick={() => setIsOpen(true)}
            className="relative p-2 rounded-md hover:bg-gray-100 text-gray-700 transition"
            title="Open Watchlist"
          >
            <Bookmark className="w-4 h-4" />
            {watchlistTickers.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#800D1B] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {watchlistTickers.length}
              </span>
            )}
          </button>

          {/* Admin CMS Portal */}
          <Link
            to="/admin"
            className="flex items-center space-x-1 px-3 py-1.5 rounded bg-[#071426] hover:bg-[#800D1B] text-white text-xs font-bold transition shadow-sm"
            title="Institutional CMS & Terminal Admin"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Terminal CMS</span>
          </Link>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md lg:hidden text-gray-700"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Primary Category Navigation Bar */}
      <nav className="border-t border-gray-200 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto no-scrollbar">
          <div className="flex items-center space-x-1 sm:space-x-2 py-2">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-1 rounded text-xs font-bold whitespace-nowrap transition-colors duration-150 uppercase tracking-wider ${
                    active
                      ? 'bg-[#071426] text-white shadow-xs'
                      : 'text-gray-700 hover:text-[#800D1B] hover:bg-gray-100'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="hidden xl:flex items-center space-x-2 text-[11px] font-mono text-gray-600">
            <span className="text-[#800D1B] font-bold">EDITION:</span>
            <span className="font-semibold text-gray-800">ASIA-PACIFIC / GLOBAL</span>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded text-sm font-semibold uppercase ${
                isActive(link.path)
                  ? 'bg-[#071426] text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
