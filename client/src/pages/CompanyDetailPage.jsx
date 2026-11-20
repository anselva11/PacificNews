import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchCompanyProfile, fetchNews } from '../services/api';
import TradingViewChart from '../components/TradingViewChart';
import { ArrowLeft } from 'lucide-react';

export default function CompanyDetailPage() {
  const { ticker } = useParams();
  const [profile, setProfile] = useState(null);
  const [relatedNews, setRelatedNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetchCompanyProfile(ticker);
        if (res.data) {
          setProfile(res.data);
          const newsRes = await fetchNews({ search: ticker, limit: 3 });
          if (newsRes.data) setRelatedNews(newsRes.data);
        }
      } catch (e) {
        console.warn('Error loading company:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
    window.scrollTo(0, 0);
  }, [ticker]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center font-mono text-xs text-gray-500">
        LOADING CORPORATE BALANCE SHEET & EARNINGS DOSSIER...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-xl font-bold text-gray-900">Profile Not Found</h2>
        <Link to="/companies" className="inline-block mt-4 text-xs font-mono font-bold text-[#800D1B] underline">
          Return to Company Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 bg-white">
      {/* Back button */}
      <Link
        to="/companies"
        className="inline-flex items-center text-xs font-mono font-bold text-gray-600 hover:text-gray-900 transition"
      >
        <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
        BACK TO COMPANY DIRECTORY
      </Link>

      {/* Top Company Profile Banner */}
      <div className="bg-gray-50 text-gray-900 p-6 rounded-lg border border-gray-200 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono">
              <span className="bg-[#800D1B] text-white px-2.5 py-0.5 rounded font-bold uppercase">{profile.exchange}</span>
              <span className="text-gray-900 font-bold">{profile.sector}</span>
              <span className="text-gray-500">• {profile.industry}</span>
            </div>
            <h1 className="font-serif text-3xl font-black mt-2 text-gray-900">
              {profile.name} <span className="text-gray-500 font-mono text-xl">({profile.ticker})</span>
            </h1>
            <p className="text-xs text-gray-600 font-mono mt-1">
              CEO: {profile.ceo} • Headquarters: {profile.headquarters}
            </p>
          </div>

          <div className="text-right font-mono">
            <span className="text-xs text-gray-500 block uppercase">MARKET CAPITALIZATION</span>
            <span className="text-2xl font-black text-gray-900">{profile.marketCap}</span>
          </div>
        </div>

        {/* Ratio Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 pt-4 border-t border-gray-200 font-mono text-xs">
          <div>
            <span className="text-gray-500 block text-[10px] font-semibold">REVENUE (TTM)</span>
            <span className="font-bold text-gray-900">{profile.revenue}</span>
          </div>
          <div>
            <span className="text-gray-500 block text-[10px] font-semibold">NET INCOME</span>
            <span className="font-bold text-gray-900">{profile.netIncome}</span>
          </div>
          <div>
            <span className="text-gray-500 block text-[10px] font-semibold">DILUTED EPS</span>
            <span className="font-bold text-gray-900">{profile.eps}</span>
          </div>
          <div>
            <span className="text-gray-500 block text-[10px] font-semibold">P/E RATIO</span>
            <span className="font-bold text-gray-900">{profile.peRatio}</span>
          </div>
          <div>
            <span className="text-gray-500 block text-[10px] font-semibold">P/B RATIO</span>
            <span className="font-bold text-gray-900">{profile.pbRatio}</span>
          </div>
          <div>
            <span className="text-gray-500 block text-[10px] font-semibold">DIV YIELD</span>
            <span className="font-bold text-gray-900">{profile.dividendYield}</span>
          </div>
          <div>
            <span className="text-gray-500 block text-[10px] font-semibold">52W RANGE</span>
            <span className="font-bold text-gray-900 truncate block">{profile.fiftyTwoWeekRange}</span>
          </div>
        </div>
      </div>

      {/* Interactive Chart */}
      <TradingViewChart
        ticker={profile.ticker}
        name={`${profile.name} Historical Stock Performance`}
        currentPrice={null}
        changePercent={null}
      />

      {/* Tabs */}
      <div className="flex border-b border-gray-200 space-x-4 text-xs font-mono font-bold uppercase">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-2 border-b-2 transition ${
            activeTab === 'overview'
              ? 'border-[#800D1B] text-gray-900'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          Company Overview & Business Model
        </button>
        <button
          onClick={() => setActiveTab('financials')}
          className={`pb-2 border-b-2 transition ${
            activeTab === 'financials'
              ? 'border-[#800D1B] text-gray-900'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          Financial Statements (SEC/Audited)
        </button>
        <button
          onClick={() => setActiveTab('earnings')}
          className={`pb-2 border-b-2 transition ${
            activeTab === 'earnings'
              ? 'border-[#800D1B] text-gray-900'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          Quarterly Earnings Surprises
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4 shadow-2xs">
          <h3 className="font-serif font-black text-base uppercase tracking-wider text-gray-900">
            Business Profile & Strategic Positioning
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed font-sans">
            {profile.overview}
          </p>
        </div>
      )}

      {/* Tab 2: Financial Statements */}
      {activeTab === 'financials' && profile.financialStatements && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-lg border border-gray-200 space-y-3 font-mono text-xs shadow-2xs">
            <h4 className="font-serif font-bold text-sm text-gray-900 border-b border-gray-200 pb-2">
              Income Statement Highlights
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Revenue</span>
                <span className="font-bold text-gray-900">{profile.financialStatements.incomeStatement.totalRevenue}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Gross Profit</span>
                <span className="font-bold text-gray-900">{profile.financialStatements.incomeStatement.grossProfit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Operating Income</span>
                <span className="font-bold text-gray-900">{profile.financialStatements.incomeStatement.operatingIncome}</span>
              </div>
              <div className="flex justify-between border-t border-gray-100 pt-1">
                <span className="text-gray-700 font-bold">Net Income</span>
                <span className="font-black text-emerald-700">{profile.financialStatements.incomeStatement.netIncome}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg border border-gray-200 space-y-3 font-mono text-xs shadow-2xs">
            <h4 className="font-serif font-bold text-sm text-gray-900 border-b border-gray-200 pb-2">
              Balance Sheet Health
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Cash & Equivalents</span>
                <span className="font-bold text-gray-900">{profile.financialStatements.balanceSheet.cashAndEquivalents}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Assets</span>
                <span className="font-bold text-gray-900">{profile.financialStatements.balanceSheet.totalAssets}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Debt</span>
                <span className="font-bold text-rose-700">{profile.financialStatements.balanceSheet.totalDebt}</span>
              </div>
              <div className="flex justify-between border-t border-gray-100 pt-1">
                <span className="text-gray-700 font-bold">Stockholders Equity</span>
                <span className="font-black text-gray-900">{profile.financialStatements.balanceSheet.stockholdersEquity}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg border border-gray-200 space-y-3 font-mono text-xs shadow-2xs">
            <h4 className="font-serif font-bold text-sm text-gray-900 border-b border-gray-200 pb-2">
              Cash Flow Generation
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Operating Cash Flow</span>
                <span className="font-bold text-gray-900">{profile.financialStatements.cashFlow.operatingCashFlow}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Capital Expenditures</span>
                <span className="font-bold text-gray-900">{profile.financialStatements.cashFlow.capitalExpenditures}</span>
              </div>
              <div className="flex justify-between border-t border-gray-100 pt-1">
                <span className="text-gray-700 font-bold">Free Cash Flow (FCF)</span>
                <span className="font-black text-emerald-700">{profile.financialStatements.cashFlow.freeCashFlow}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Dividends Paid</span>
                <span className="font-bold text-gray-900">{profile.financialStatements.cashFlow.dividendsPaid}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Quarterly Earnings */}
      {activeTab === 'earnings' && profile.quarterlyEarnings && (
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-2xs">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-gray-200 text-gray-600 uppercase text-[10px]">
                <th className="py-2.5 font-bold">Quarter</th>
                <th className="py-2.5 text-right font-bold">EPS Actual</th>
                <th className="py-2.5 text-right font-bold">EPS Estimate</th>
                <th className="py-2.5 text-right font-bold">Surprise</th>
                <th className="py-2.5 text-right font-bold">Revenue Actual ($B)</th>
                <th className="py-2.5 text-right font-bold">Revenue Est ($B)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {profile.quarterlyEarnings.map(q => {
                const surprise = q.epsActual - q.epsEstimate;
                const isBeat = surprise >= 0;
                return (
                  <tr key={q.quarter}>
                    <td className="py-2.5 font-bold text-gray-900">{q.quarter}</td>
                    <td className="py-2.5 text-right font-bold text-gray-900">{q.epsActual}</td>
                    <td className="py-2.5 text-right text-gray-600">{q.epsEstimate}</td>
                    <td className={`py-2.5 text-right font-bold ${isBeat ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {isBeat ? '+' : ''}{surprise.toFixed(2)}
                    </td>
                    <td className="py-2.5 text-right font-bold text-gray-900">{q.revActual}</td>
                    <td className="py-2.5 text-right text-gray-600">{q.revEstimate}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Associated News */}
      {relatedNews.length > 0 && (
        <div className="pt-6 border-t border-gray-200">
          <h3 className="font-serif font-black text-sm uppercase tracking-wider text-gray-900 mb-4">
            Recent Intelligence on {profile.name}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedNews.map(n => (
              <Link
                key={n.id}
                to={`/news/${n.id}`}
                className="p-4 rounded-lg bg-white border border-gray-200 hover:border-gray-300 transition block space-y-1 shadow-2xs"
              >
                <span className="text-[10px] font-mono text-[#800D1B] font-bold uppercase">{n.category}</span>
                <h4 className="font-serif text-xs font-bold text-gray-900 line-clamp-2">{n.headline}</h4>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
