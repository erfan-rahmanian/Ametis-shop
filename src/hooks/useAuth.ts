
"use client"; // Because it uses localStorage and provides context to client components

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { AuthUser } from '@/lib/types';

const AUTH_KEY = 'amethystShopAuthUser';

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password?: string) => void;
  register: (email: string, password?: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Reflects initial hydration state

  useEffect(() => {
    // Load user from localStorage on initial mount
    try {
      const storedUser = localStorage.getItem(AUTH_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("خطا در بارگذاری کاربر از localStorage:", error);
      localStorage.removeItem(AUTH_KEY); // Clear potentially corrupted data
    }
    setIsLoading(false); // Set loading to false ONLY after attempting to load from storage
  }, []);

  const login = useCallback((email: string, _password?: string) => {
    const newUser = { email };
    localStorage.setItem(AUTH_KEY, JSON.stringify(newUser));
    setUser(newUser);
  }, []);

  const register = useCallback((email: string, _password?: string) => {
    const newUser = { email };
    localStorage.setItem(AUTH_KEY, JSON.stringify(newUser));
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_KEY);
    setUser(null);
  }, []);

  // Define the context value object separately for clarity
  const authContextValue: AuthContextType = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isLoading,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
