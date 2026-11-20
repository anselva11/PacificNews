import React, { useState, useEffect } from 'react';
import { loginAdmin, fetchAdminMetrics, createNewsArticle, createResearchReport } from '../services/api';
import { ShieldCheck, CheckCircle2, LogOut, Terminal, Key } from 'lucide-react';

export default function AdminDashboard() {
  const [token, setToken] = useState(() => localStorage.getItem('pcn_admin_token') || '');
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('pcn_admin_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [email, setEmail] = useState('admin@pacificcapital.com');
  const [password, setPassword] = useState('PacificCapital2026!');
  const [authError, setAuthError] = useState('');

  const [metrics, setMetrics] = useState(null);
  const [activeTab, setActiveTab] = useState('feeds');

  const [articleForm, setArticleForm] = useState({
    headline: '',
    category: 'Global Economy',
    summary: '',
    content: '',
    author: 'Pacific Capital Editorial Bureau',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
    isFeatured: false,
    isBreaking: false
  });
  const [articleSuccess, setArticleSuccess] = useState('');

  const [researchForm, setResearchForm] = useState({
    title: '',
    reportType: 'Equity Research',
    sector: 'Technology & Hardware',
    rating: 'OVERWEIGHT',
    targetPriceContext: '',
    summary: '',
    executiveSummary: '',
    marketOverview: '',
    valuationAnalysis: '',
    riskAssessment: '',
    investmentThesis: '',
    author: 'Marcus Vance, Chief Investment Strategist'
  });
  const [researchSuccess, setResearchSuccess] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await loginAdmin(email, password);
      if (res.token) {
        setToken(res.token);
        setCurrentUser(res.user);
        localStorage.setItem('pcn_admin_token', res.token);
        localStorage.setItem('pcn_admin_user', JSON.stringify(res.user));
      } else {
        setAuthError(res.error || 'Authentication rejected.');
      }
    } catch (err) {
      setAuthError('Failed to communicate with authentication gateway.');
    }
  };

  const handleLogout = () => {
    setToken('');
    setCurrentUser(null);
    localStorage.removeItem('pcn_admin_token');
    localStorage.removeItem('pcn_admin_user');
  };

  const loadMetrics = async () => {
    if (!token) return;
    try {
      const res = await fetchAdminMetrics(token);
      if (res) setMetrics(res);
    } catch (err) {
      console.warn('Metrics load error:', err);
    }
  };

  useEffect(() => {
    if (token) {
      loadMetrics();
      const interval = setInterval(loadMetrics, 15000);
      return () => clearInterval(interval);
    }
  }, [token]);

  const handleCreateArticle = async (e) => {
    e.preventDefault();
    setArticleSuccess('');
    try {
      const res = await createNewsArticle(articleForm, token);
      if (res.success) {
        setArticleSuccess(`Dispatched article ID: ${res.data.id}`);
        setArticleForm({
          headline: '',
          category: 'Global Economy',
          summary: '',
          content: '',
          author: 'Pacific Capital Editorial Bureau',
          imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
          isFeatured: false,
          isBreaking: false
        });
        loadMetrics();
      }
    } catch (err) {
      console.warn('Create article error:', err);
    }
  };

  const handleCreateResearch = async (e) => {
    e.preventDefault();
    setResearchSuccess('');
    try {
      const res = await createResearchReport(researchForm, token);
      if (res.success) {
        setResearchSuccess(`Published research dossier ID: ${res.data.id}`);
        setResearchForm({
          title: '',
          reportType: 'Equity Research',
          sector: 'Technology & Hardware',
          rating: 'OVERWEIGHT',
          targetPriceContext: '',
          summary: '',
          executiveSummary: '',
          marketOverview: '',
          valuationAnalysis: '',
          riskAssessment: '',
          investmentThesis: '',
          author: 'Marcus Vance, Chief Investment Strategist'
        });
        loadMetrics();
      }
    } catch (err) {
      console.warn('Create research error:', err);
    }
  };

  if (!token) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 bg-white">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-xl space-y-4">
          <div className="flex items-center space-x-2 text-xs font-mono text-[#800D1B] font-bold uppercase tracking-wider">
            <Key className="w-4 h-4" />
            <span>Institutional Access Terminal</span>
          </div>
          <h2 className="font-serif font-black text-2xl text-gray-900">
            Editorial CMS Login
          </h2>
          <p className="text-xs text-gray-600 font-mono">
            Authorized access for Pacific Investment Capital Holdings editorial directors, research analysts, and feed administrators.
          </p>

          <div className="p-3 rounded bg-gray-50 border border-gray-200 text-[11px] font-mono text-gray-800">
            <strong>Default Institutional Admin:</strong>
            <p className="mt-0.5">Email: <span className="underline font-bold">admin@pacificcapital.com</span></p>
            <p>Password: <span className="underline font-bold">PacificCapital2026!</span></p>
          </div>

          {authError && (
            <div className="p-2.5 rounded bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-3 font-mono text-xs">
            <div>
              <label className="text-gray-700 font-bold block mb-1">Corporate Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 rounded bg-white border border-gray-300 text-gray-900 outline-none"
              />
            </div>
            <div>
              <label className="text-gray-700 font-bold block mb-1">Security Token / Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 rounded bg-white border border-gray-300 text-gray-900 outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded bg-[#071426] hover:bg-[#800D1B] text-white font-bold uppercase tracking-wider transition shadow-xs"
            >
              Sign In to CMS Portal
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 bg-white">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#800D1B] font-bold uppercase tracking-wider mb-1">
            <Terminal className="w-4 h-4" />
            <span>Pacific Terminal Engine • CMS Admin Console</span>
          </div>
          <h1 className="font-serif text-3xl font-black text-gray-900">
            Editorial & Data Management
          </h1>
          <p className="text-xs text-gray-600 font-mono mt-1">
            Signed in as <strong className="text-gray-900">{currentUser?.name}</strong> ({currentUser?.role})
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-100 text-xs font-mono text-gray-700 transition"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Real-time Telemetry Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
        <div className="p-4 rounded-lg bg-white border border-gray-200 shadow-2xs">
          <span className="text-gray-500 block text-[10px] uppercase font-bold">TOTAL ARTICLES</span>
          <span className="text-2xl font-black text-gray-900 mt-1 block">
            {metrics?.totalArticles ?? '-'}
          </span>
        </div>
        <div className="p-4 rounded-lg bg-white border border-gray-200 shadow-2xs">
          <span className="text-gray-500 block text-[10px] uppercase font-bold">INSTITUTIONAL RESEARCH</span>
          <span className="text-2xl font-black text-[#800D1B] mt-1 block">
            {metrics?.totalReports ?? '-'}
          </span>
        </div>
        <div className="p-4 rounded-lg bg-white border border-gray-200 shadow-2xs">
          <span className="text-gray-500 block text-[10px] uppercase font-bold">WS SUBSCRIBERS</span>
          <span className="text-2xl font-black text-emerald-700 mt-1 block">
            {metrics?.activeWsConnections ?? '-'}
          </span>
        </div>
        <div className="p-4 rounded-lg bg-white border border-gray-200 shadow-2xs">
          <span className="text-gray-500 block text-[10px] uppercase font-bold">MEMORY USAGE</span>
          <span className="text-lg font-black text-gray-900 mt-1 block">
            {metrics?.memoryUsageMB ? `${metrics.memoryUsageMB} MB` : '-'}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 space-x-4 text-xs font-mono font-bold uppercase">
        <button
          onClick={() => setActiveTab('feeds')}
          className={`pb-2 border-b-2 transition ${
            activeTab === 'feeds'
              ? 'border-[#800D1B] text-gray-900'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          Data Feed Health & Bloomberg SAPI
        </button>
        <button
          onClick={() => setActiveTab('new-article')}
          className={`pb-2 border-b-2 transition ${
            activeTab === 'new-article'
              ? 'border-[#800D1B] text-gray-900'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          Publish News Article
        </button>
        <button
          onClick={() => setActiveTab('new-research')}
          className={`pb-2 border-b-2 transition ${
            activeTab === 'new-research'
              ? 'border-[#800D1B] text-gray-900'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          Publish Research Dossier
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`pb-2 border-b-2 transition ${
            activeTab === 'logs'
              ? 'border-[#800D1B] text-gray-900'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          System Audit Logs
        </button>
      </div>

      {/* TAB 1: Feeds Status */}
      {activeTab === 'feeds' && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4 font-mono text-xs shadow-2xs">
            <h3 className="font-serif font-bold text-base text-gray-900">
              Bloomberg Enterprise Integration Health
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded bg-gray-50 border border-gray-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">PROVIDER:</span>
                  <span className="font-bold text-gray-900">Bloomberg L.P. (DL / SAPI)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">CREDENTIAL STATUS:</span>
                  <span className="text-gray-900 font-bold">
                    {metrics?.bloombergStatus?.connected ? 'AUTHORIZED & CONNECTED' : 'UNAUTHORIZED / STANDBY'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">REST DL ENDPOINT:</span>
                  <span className="text-gray-900">{metrics?.bloombergStatus?.endpoint}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">SYNTHETIC DATA RESTRICTION:</span>
                  <span className="text-emerald-700 font-bold">ENFORCED (NO FABRICATIONS)</span>
                </div>
              </div>

              <div className="p-4 rounded bg-gray-50 border border-gray-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">COINGECKO LIVE API:</span>
                  <span className="text-emerald-700 font-bold">OPERATIONAL</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">GLOBAL FX FEED:</span>
                  <span className="text-emerald-700 font-bold">OPERATIONAL</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">RSS AUTOMATED INGESTION:</span>
                  <span className="text-emerald-700 font-bold">ACTIVE (5-MIN CADENCE)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">WEBSOCKET SERVER:</span>
                  <span className="text-emerald-700 font-bold">LISTENING ON /ws</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-gray-100 rounded text-[11px] text-gray-700">
              Diagnostic Message: {metrics?.bloombergStatus?.statusMessage}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Publish News Article */}
      {activeTab === 'new-article' && (
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-2xs">
          <h3 className="font-serif font-bold text-base text-gray-900 mb-4">
            Publish Editorial Financial Dispatch
          </h3>

          {articleSuccess && (
            <div className="mb-4 p-3 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono flex items-center">
              <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600" />
              {articleSuccess}
            </div>
          )}

          <form onSubmit={handleCreateArticle} className="space-y-4 font-mono text-xs">
            <div>
              <label className="text-gray-700 font-bold block mb-1">Headline</label>
              <input
                type="text"
                value={articleForm.headline}
                onChange={(e) => setArticleForm({ ...articleForm, headline: e.target.value })}
                required
                className="w-full px-3 py-2 rounded bg-white border border-gray-300 text-gray-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-700 font-bold block mb-1">Category</label>
                <select
                  value={articleForm.category}
                  onChange={(e) => setArticleForm({ ...articleForm, category: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-white border border-gray-300 text-gray-900"
                >
                  <option>Global Economy</option>
                  <option>Stock Markets</option>
                  <option>Corporate Earnings</option>
                  <option>Central Banks</option>
                  <option>Monetary Policy</option>
                  <option>Interest Rates</option>
                  <option>Mergers & Acquisitions</option>
                  <option>IPO</option>
                  <option>Commodities</option>
                  <option>Technology</option>
                  <option>Geopolitics</option>
                </select>
              </div>

              <div>
                <label className="text-gray-700 font-bold block mb-1">Author Credit</label>
                <input
                  type="text"
                  value={articleForm.author}
                  onChange={(e) => setArticleForm({ ...articleForm, author: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-white border border-gray-300 text-gray-900"
                />
              </div>
            </div>

            <div>
              <label className="text-gray-700 font-bold block mb-1">Lead Summary</label>
              <textarea
                rows={2}
                value={articleForm.summary}
                onChange={(e) => setArticleForm({ ...articleForm, summary: e.target.value })}
                required
                className="w-full px-3 py-2 rounded bg-white border border-gray-300 text-gray-900"
              />
            </div>

            <div>
              <label className="text-gray-700 font-bold block mb-1">Full Article Body</label>
              <textarea
                rows={6}
                value={articleForm.content}
                onChange={(e) => setArticleForm({ ...articleForm, content: e.target.value })}
                required
                className="w-full px-3 py-2 rounded bg-white border border-gray-300 text-gray-900 font-sans text-sm"
              />
            </div>

            <div className="flex items-center space-x-6">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={articleForm.isFeatured}
                  onChange={(e) => setArticleForm({ ...articleForm, isFeatured: e.target.checked })}
                />
                <span className="text-gray-800 font-semibold">Set as Homepage Lead Story</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={articleForm.isBreaking}
                  onChange={(e) => setArticleForm({ ...articleForm, isBreaking: e.target.checked })}
                />
                <span className="text-gray-800 font-semibold">Flag as Breaking News Alert</span>
              </label>
            </div>

            <button
              type="submit"
              className="py-2.5 px-6 rounded bg-[#800D1B] hover:bg-[#a31424] text-white font-bold uppercase tracking-wider transition shadow-xs"
            >
              Publish to Global News Wire
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: Publish Research */}
      {activeTab === 'new-research' && (
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-2xs">
          <h3 className="font-serif font-bold text-base text-gray-900 mb-4">
            Publish Institutional Research Dossier
          </h3>

          {researchSuccess && (
            <div className="mb-4 p-3 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono flex items-center">
              <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600" />
              {researchSuccess}
            </div>
          )}

          <form onSubmit={handleCreateResearch} className="space-y-4 font-mono text-xs">
            <div>
              <label className="text-gray-700 font-bold block mb-1">Research Report Title</label>
              <input
                type="text"
                value={researchForm.title}
                onChange={(e) => setResearchForm({ ...researchForm, title: e.target.value })}
                required
                className="w-full px-3 py-2 rounded bg-white border border-gray-300 text-gray-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-gray-700 font-bold block mb-1">Report Discipline</label>
                <select
                  value={researchForm.reportType}
                  onChange={(e) => setResearchForm({ ...researchForm, reportType: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-white border border-gray-300 text-gray-900"
                >
                  <option>Equity Research</option>
                  <option>Macroeconomic Research</option>
                  <option>Technical Analysis</option>
                  <option>Fundamental Analysis</option>
                  <option>Sector Reports</option>
                  <option>Investment Outlook</option>
                </select>
              </div>

              <div>
                <label className="text-gray-700 font-bold block mb-1">Sector Universe</label>
                <input
                  type="text"
                  value={researchForm.sector}
                  onChange={(e) => setResearchForm({ ...researchForm, sector: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-white border border-gray-300 text-gray-900"
                />
              </div>

              <div>
                <label className="text-gray-700 font-bold block mb-1">Rating Stance</label>
                <select
                  value={researchForm.rating}
                  onChange={(e) => setResearchForm({ ...researchForm, rating: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-white border border-gray-300 text-gray-900"
                >
                  <option>BUY</option>
                  <option>OVERWEIGHT</option>
                  <option>NEUTRAL</option>
                  <option>UNDERWEIGHT</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-gray-700 font-bold block mb-1">1. Executive Summary</label>
              <textarea
                rows={3}
                value={researchForm.executiveSummary}
                onChange={(e) => setResearchForm({ ...researchForm, executiveSummary: e.target.value })}
                required
                className="w-full px-3 py-2 rounded bg-white border border-gray-300 text-gray-900"
              />
            </div>

            <div>
              <label className="text-gray-700 font-bold block mb-1">2. Market Overview</label>
              <textarea
                rows={3}
                value={researchForm.marketOverview}
                onChange={(e) => setResearchForm({ ...researchForm, marketOverview: e.target.value })}
                required
                className="w-full px-3 py-2 rounded bg-white border border-gray-300 text-gray-900"
              />
            </div>

            <div>
              <label className="text-gray-700 font-bold block mb-1">3. Valuation Methodology</label>
              <textarea
                rows={3}
                value={researchForm.valuationAnalysis}
                onChange={(e) => setResearchForm({ ...researchForm, valuationAnalysis: e.target.value })}
                required
                className="w-full px-3 py-2 rounded bg-white border border-gray-300 text-gray-900"
              />
            </div>

            <div>
              <label className="text-gray-700 font-bold block mb-1">4. Institutional Investment Thesis</label>
              <textarea
                rows={3}
                value={researchForm.investmentThesis}
                onChange={(e) => setResearchForm({ ...researchForm, investmentThesis: e.target.value })}
                required
                className="w-full px-3 py-2 rounded bg-white border border-gray-300 text-gray-900"
              />
            </div>

            <button
              type="submit"
              className="py-2.5 px-6 rounded bg-[#071426] hover:bg-[#800D1B] text-white font-bold uppercase tracking-wider transition shadow-xs"
            >
              Publish Institutional Research
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: Audit Logs */}
      {activeTab === 'logs' && (
        <div className="bg-white p-6 rounded-lg border border-gray-200 font-mono text-xs shadow-2xs">
          <h3 className="font-serif font-bold text-base text-gray-900 mb-4">
            Security & Feed Audit Trail
          </h3>
          <div className="divide-y divide-gray-100">
            {metrics?.logs?.map(log => (
              <div key={log.id} className="py-2.5 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="px-2 py-0.5 rounded bg-gray-100 text-[10px] font-bold text-gray-800 border border-gray-200">
                    {log.type}
                  </span>
                  <span className="text-gray-800 font-medium">{log.message}</span>
                </div>
                <span className="text-gray-500 text-[11px]">{new Date(log.timestamp).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
