import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { fetchMarketQuotes } from '../services/api';

const MarketContext = createContext();

export function MarketProvider({ children }) {
  const [quotes, setQuotes] = useState([]);
  const [bloombergStatus, setBloombergStatus] = useState(null);
  const [wsConnected, setWsConnected] = useState(false);
  const [lastTickTimes, setLastTickTimes] = useState({});
  const [marketTimes, setMarketTimes] = useState({
    utc: '',
    est: '',
    lon: '',
    tyo: '',
    jkt: ''
  });

  const wsRef = useRef(null);

  // Time ticker in major financial centers
  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();
      setMarketTimes({
        utc: now.toLocaleTimeString('en-GB', { timeZone: 'UTC', hour12: false }),
        est: now.toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour12: false }),
        lon: now.toLocaleTimeString('en-GB', { timeZone: 'Europe/London', hour12: false }),
        tyo: now.toLocaleTimeString('ja-JP', { timeZone: 'Asia/Tokyo', hour12: false }),
        jkt: now.toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta', hour12: false })
      });
    };
    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, []);

  // Initial HTTP snapshot
  useEffect(() => {
    async function loadInitial() {
      try {
        const res = await fetchMarketQuotes();
        if (res.data) {
          setQuotes(res.data);
        }
        if (res.bloombergStatus) {
          setBloombergStatus(res.bloombergStatus);
        }
      } catch (err) {
        console.warn('Initial market quotes fetch failed:', err);
      }
    }
    loadInitial();
  }, []);

  // WebSocket Live Connection
  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;

    function connectWs() {
      const socket = new WebSocket(wsUrl);
      wsRef.current = socket;

      socket.onopen = () => {
        setWsConnected(true);
      };

      socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === 'SNAPSHOT' || payload.type === 'TICK') {
            if (payload.data) {
              setQuotes(prev => {
                // track tick direction for flashing
                const updatedTicks = {};
                payload.data.forEach(newQ => {
                  const oldQ = prev.find(p => p.id === newQ.id);
                  if (oldQ && oldQ.price !== null && newQ.price !== null && oldQ.price !== newQ.price) {
                    updatedTicks[newQ.id] = newQ.price > oldQ.price ? 'up' : 'down';
                  }
                });
                if (Object.keys(updatedTicks).length > 0) {
                  setLastTickTimes(prevTicks => ({ ...prevTicks, ...updatedTicks }));
                  // Clear tick flash after 1.5s
                  setTimeout(() => {
                    setLastTickTimes({});
                  }, 1500);
                }
                return payload.data;
              });
            }
            if (payload.bloombergStatus) {
              setBloombergStatus(payload.bloombergStatus);
            }
          }
        } catch (e) {
          // ignore
        }
      };

      socket.onclose = () => {
        setWsConnected(false);
        // Retry connection in 4s
        setTimeout(connectWs, 4000);
      };

      socket.onerror = () => {
        socket.close();
      };
    }

    connectWs();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const getQuote = (id) => {
    return quotes.find(q => q.id === id) || null;
  };

  const getQuotesByCategory = (category) => {
    return quotes.filter(q => q.category === category);
  };

  return (
    <MarketContext.Provider value={{
      quotes,
      getQuote,
      getQuotesByCategory,
      bloombergStatus,
      wsConnected,
      lastTickTimes,
      marketTimes
    }}>
      {children}
    </MarketContext.Provider>
  );
}

export function useMarket() {
  return useContext(MarketContext);
}
