import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchWatchlist, toggleWatchlist as apiToggleWatchlist } from '../services/api';

const WatchlistContext = createContext();

export function WatchlistProvider({ children }) {
  const [watchlistTickers, setWatchlistTickers] = useState(['SPX', 'NVDA', 'BTC', 'GOLD', 'EUR_USD', 'IHSG']);
  const [watchlistQuotes, setWatchlistQuotes] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const refreshWatchlist = async () => {
    try {
      const res = await fetchWatchlist();
      if (res.tickers) setWatchlistTickers(res.tickers);
      if (res.quotes) setWatchlistQuotes(res.quotes);
    } catch (err) {
      console.warn('Watchlist fetch error:', err);
    }
  };

  useEffect(() => {
    refreshWatchlist();
  }, []);

  const toggleItem = async (ticker) => {
    try {
      const res = await apiToggleWatchlist(ticker);
      if (res.watchlist) {
        setWatchlistTickers(res.watchlist);
        refreshWatchlist();
      }
    } catch (err) {
      console.warn('Toggle error:', err);
    }
  };

  const isInWatchlist = (ticker) => {
    return watchlistTickers.includes(ticker);
  };

  return (
    <WatchlistContext.Provider value={{
      watchlistTickers,
      watchlistQuotes,
      isOpen,
      setIsOpen,
      toggleItem,
      isInWatchlist,
      refreshWatchlist
    }}>
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  return useContext(WatchlistContext);
}
