import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { setAccessToken } from '../api/axiosClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  const login = useCallback((newToken, userInfo) => {
    setAccessToken(newToken);
    setToken(newToken);
    setUser(userInfo || null);
  }, []);

  const logout = useCallback(() => {
    setAccessToken(null);
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ token, user, isAuthenticated: !!token, login, logout }),
    [token, user, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được dùng bên trong AuthProvider');
  }
  return context;
}
