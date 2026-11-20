const API_BASE = '/api';

export async function fetchMarketQuotes(category) {
  const url = category ? `${API_BASE}/market/quotes?category=${category}` : `${API_BASE}/market/quotes`;
  const res = await fetch(url);
  return res.json();
}

export async function fetchMarketQuote(ticker) {
  const res = await fetch(`${API_BASE}/market/quote/${ticker}`);
  return res.json();
}

export async function fetchHistoricalSeries(ticker, range = '1M') {
  const res = await fetch(`${API_BASE}/market/history/${ticker}?range=${range}`);
  return res.json();
}

export async function fetchMarketStatus() {
  const res = await fetch(`${API_BASE}/market/status`);
  return res.json();
}

export async function fetchNews({ category, search, limit, featured } = {}) {
  const params = new URLSearchParams();
  if (category) params.append('category', category);
  if (search) params.append('search', search);
  if (limit) params.append('limit', limit);
  if (featured !== undefined) params.append('featured', featured);

  const res = await fetch(`${API_BASE}/news?${params.toString()}`);
  return res.json();
}

export async function fetchArticle(id) {
  const res = await fetch(`${API_BASE}/news/${id}`);
  return res.json();
}

export async function fetchResearch({ sector, reportType, search } = {}) {
  const params = new URLSearchParams();
  if (sector) params.append('sector', sector);
  if (reportType) params.append('reportType', reportType);
  if (search) params.append('search', search);

  const res = await fetch(`${API_BASE}/research?${params.toString()}`);
  return res.json();
}

export async function fetchResearchReport(id) {
  const res = await fetch(`${API_BASE}/research/${id}`);
  return res.json();
}

export async function fetchCalendar({ country, importance, dateFrom, dateTo } = {}) {
  const params = new URLSearchParams();
  if (country) params.append('country', country);
  if (importance) params.append('importance', importance);
  if (dateFrom) params.append('dateFrom', dateFrom);
  if (dateTo) params.append('dateTo', dateTo);

  const res = await fetch(`${API_BASE}/calendar?${params.toString()}`);
  return res.json();
}

export async function fetchCompanies() {
  const res = await fetch(`${API_BASE}/companies`);
  return res.json();
}

export async function fetchCompanyProfile(ticker) {
  const res = await fetch(`${API_BASE}/companies/${ticker}`);
  return res.json();
}

export async function fetchWatchlist() {
  const res = await fetch(`${API_BASE}/watchlist`);
  return res.json();
}

export async function toggleWatchlist(ticker) {
  const res = await fetch(`${API_BASE}/watchlist/toggle`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ticker })
  });
  return res.json();
}

export async function loginAdmin(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return res.json();
}

export async function fetchAdminMetrics(token) {
  const res = await fetch(`${API_BASE}/admin/metrics`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
}

export async function createNewsArticle(data, token) {
  const res = await fetch(`${API_BASE}/news`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function createResearchReport(data, token) {
  const res = await fetch(`${API_BASE}/research`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return res.json();
}
