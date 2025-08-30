import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

interface User {
  userId: number;
  email: string;
  username: string;
  points: number;
  level: number;
  pokemonPet?: {
    name: string;
    spriteStage1: string;
    spriteStage2: string;
    spriteStage3: string;
  };
  gamification?: {
    streakCount: number;
    badges: string[];
  };
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithToken: (token: string, user: User) => void;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authApi.setToken(token);
      refreshUser();
    } else {
      setLoading(false);
    }
  }, []);

  const refreshUser = async () => {
    try {
      const response = await authApi.getCurrentUser();
      setUser(response.data.user);
    } catch (error) {
      console.error('Failed to refresh user:', error);
      localStorage.removeItem('token');
      authApi.setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login(email, password);
      const { user, token } = response.data;
      
      localStorage.setItem('token', token);
      authApi.setToken(token);
      setUser(user);
    } catch (error) {
      throw error;
    }
  };

  const loginWithToken = (token: string, user: User) => {
    localStorage.setItem('token', token);
    authApi.setToken(token);
    setUser(user);
  };

  const register = async (email: string, username: string, password: string) => {
    try {
      const response = await authApi.register(email, username, password);
      const { user, token } = response.data;
      
      localStorage.setItem('token', token);
      authApi.setToken(token);
      setUser(user);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    authApi.setToken(null);
    setUser(null);
  };

  const value = {
    user,
    login,
    loginWithToken,
    register,
    logout,
    loading,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};