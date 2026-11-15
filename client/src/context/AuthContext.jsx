import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axiosInstance';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.warn('[AuthContext] Corrupt user in localStorage, resetting to null:', e.message);
      localStorage.removeItem('user');
      return null;
    }
  });
  const [hasRegistered, setHasRegistered] = useState(false);
  const [registrationId, setRegistrationId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch current user profile (using HttpOnly cookie or Authorization header fallback)
  const fetchProfile = useCallback(async (authToken) => {
    try {
      const res = await api.get('/user/me');
      if (res.data?.success && res.data.data?.user) {
        setUser(res.data.data.user);
        setHasRegistered(Boolean(res.data.data.hasRegistered));
        setRegistrationId(res.data.data.registrationId || null);
        localStorage.setItem('user', JSON.stringify(res.data.data.user));
        if (authToken) {
          setToken(authToken);
          localStorage.setItem('token', authToken);
        }
      }
    } catch (err) {
      // 401 is expected if not logged in
      setUser(null);
      setToken(null);
      setHasRegistered(false);
      setRegistrationId(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Attempt profile fetch on app load to restore session from HttpOnly cookie
    fetchProfile(token);

    // Listen for 401 unauthorized events from Axios interceptor
    const handleUnauthorized = () => {
      setUser(null);
      setToken(null);
      setHasRegistered(false);
      setRegistrationId(null);
      toast.error('Session expired. Please log in again.');
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [fetchProfile, token]);

  // Login handler
  const login = (newToken, userData) => {
    if (newToken) {
      setToken(newToken);
      localStorage.setItem('token', newToken);
    }
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    fetchProfile(newToken);
  };

  // Logout handler
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      // Ignore network error on logout
    }
    setToken(null);
    setUser(null);
    setHasRegistered(false);
    setRegistrationId(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully.');
  };

  // Re-fetch profile & registration state
  const refreshProfile = async () => {
    await fetchProfile(token);
  };

  const value = {
    user,
    token,
    isAuthenticated: Boolean(user),
    hasRegistered,
    registrationId,
    loading,
    login,
    logout,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
