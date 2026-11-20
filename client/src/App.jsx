import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import TickerBar from './components/TickerBar';
import Footer from './components/Footer';
import SearchModal from './components/SearchModal';
import WatchlistDrawer from './components/WatchlistDrawer';

// Pages
import HomePage from './pages/HomePage';
import MarketsPage from './pages/MarketsPage';
import CategoryPage from './pages/CategoryPage';
import CompaniesPage from './pages/CompaniesPage';
import CompanyDetailPage from './pages/CompanyDetailPage';
import ResearchPage from './pages/ResearchPage';
import ResearchDetailPage from './pages/ResearchDetailPage';
import CalendarPage from './pages/CalendarPage';
import NewsDetailPage from './pages/NewsDetailPage';

export default function App() {
  const [searchOpen, setSearchOpen] = useState(false);

  // Global keyboard shortcut for search (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#111827]">
      {/* Institutional Top Navigation */}
      <Navbar onOpenSearch={() => setSearchOpen(true)} />

      {/* Real-time Scrolling Market Ticker Bar */}
      <TickerBar />

      {/* Main Content Area */}
      <main className="flex-1 bg-white">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/markets" element={<MarketsPage />} />
          
          {/* Specific Categories */}
          <Route
            path="/economy"
            element={
              <CategoryPage
                categoryName="Global Economy"
                categoryDescription="Macroeconomic indicators, labor statistics, sovereign fiscal policy, and GDP trendlines."
                assetCategory="EQUITY_INDICES"
              />
            }
          />
          <Route
            path="/technology"
            element={
              <CategoryPage
                categoryName="Technology"
                categoryDescription="Advanced semiconductor fabrication, cloud infrastructure CapEx, and enterprise AI."
                assetCategory="EQUITY_INDICES"
              />
            }
          />
          <Route
            path="/commodities"
            element={
              <CategoryPage
                categoryName="Commodities"
                categoryDescription="Crude oil benchmarks, precious metals spot pricing, natural gas reserves, and industrial agriculture."
                assetCategory="COMMODITIES"
              />
            }
          />
          <Route
            path="/currencies"
            element={
              <CategoryPage
                categoryName="Currencies"
                categoryDescription="Foreign exchange cross rates, central bank reserve balances, and sovereign currency volatility."
                assetCategory="FOREX"
              />
            }
          />
          <Route
            path="/crypto"
            element={
              <CategoryPage
                categoryName="Crypto"
                categoryDescription="Digital asset market capitalization, regulated spot ETF liquidity, and blockchain treasury adoption."
                assetCategory="CRYPTO"
              />
            }
          />
          <Route
            path="/opinion"
            element={
              <CategoryPage
                categoryName="Opinion"
                categoryDescription="Editorial perspectives, Chief Economist columns, and guest insights from global investment leaders."
              />
            }
          />

          {/* Companies Directory & Profiles */}
          <Route path="/companies" element={<CompaniesPage />} />
          <Route path="/companies/:ticker" element={<CompanyDetailPage />} />

          {/* Research & Analysis */}
          <Route path="/research" element={<ResearchPage />} />
          <Route path="/research/:id" element={<ResearchDetailPage />} />

          {/* Economic Calendar */}
          <Route path="/calendar" element={<CalendarPage />} />

          {/* Individual News Article Reader */}
          <Route path="/news/:id" element={<NewsDetailPage />} />
        </Routes>
      </main>

      {/* Global Interactive Modals and Drawers */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <WatchlistDrawer />

      {/* Institutional Legal & Editorial Footer */}
      <Footer />
    </div>
  );
}
