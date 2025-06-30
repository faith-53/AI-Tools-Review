import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

// Helper to parse JWT and extract payload
function parseJwt(token) {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = parseJwt(token);
      setUser(payload ? { ...payload, token } : null);
    } else {
      setUser(null);
    }
  }, []);

  // Register function
  const register = async (email, password) => {
    try {
      const res = await api.post('api/auth/register', { email, password });
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        setUser({ email, role: res.data.role, token: res.data.token });
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      const res = await api.post('api/auth/login', { email, password });
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        setUser({ email, role: res.data.role, token: res.data.token });
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  // Stub login/logout (implement as needed)
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 