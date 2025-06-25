import React, { createContext, useState, useEffect } from 'react';
import { initializeApi } from '../services/api';

export const ApiStatusContext = createContext({
  isRemote: false,
  loading: true,
});

export const ApiStatusProvider = ({ children }) => {
  const [isRemote, setIsRemote] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkApi = async () => {
      let remote = false;
      const originalConsoleWarn = console.warn;
      console.warn = (msg) => {
        if (
          typeof msg === 'string' &&
          msg.includes('Utilizando o backend de fallback')
        ) {
          remote = true;
        }
        originalConsoleWarn(msg);
      };
      await initializeApi();
      setIsRemote(remote);
      setLoading(false);
      console.warn = originalConsoleWarn;
    };
    checkApi();
  }, []);

  return (
    <ApiStatusContext.Provider value={{ isRemote, loading }}>
      {children}
    </ApiStatusContext.Provider>
  );
};
