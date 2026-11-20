import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { MarketProvider } from './context/MarketContext.jsx';
import { WatchlistProvider } from './context/WatchlistContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <MarketProvider>
          <WatchlistProvider>
            <App />
          </WatchlistProvider>
        </MarketProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
