import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { API_URL } from '../api/API.js';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(() => Cookies.get('token') || null);

  const fetchProfile = async (currentToken) => {
    try {
      const res = await fetch(`${API_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${currentToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        Cookies.remove('token');
        setToken(null);
        setUser(null);
      }
    } catch (err) {
      Cookies.remove('token');
      setToken(null);
      setUser(null);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProfile(token).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (newToken, userData) => {
    Cookies.set('token', newToken, { expires: 1 });
    setToken(newToken);
    if (userData) {
      setUser(userData);
    } else {
      await fetchProfile(newToken);
    }
  };

  const logout = () => {
    Cookies.remove('token');
    setToken(null);
    setUser(null);
  };

  const updateUser = (data) => {
    setUser((prev) => ({ ...prev, ...data }));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading, token }}>
      {children}
    </AuthContext.Provider>
  );
};
