// "use client" directive is not needed in hooks that don't render JSX
// but this hook uses localStorage which is client-side only.
// Components using this hook must be client components.
import { useState, useEffect, useCallback } from 'react';
import type { AuthUser } from '@/lib/types';

const AUTH_KEY = 'amethystShopAuthUser';

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true); // To handle initial load from localStorage

  useEffect(() => {
    // This effect runs only on the client side
    try {
      const storedUser = localStorage.getItem(AUTH_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to load user from localStorage", error);
      localStorage.removeItem(AUTH_KEY); // Clear corrupted data
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((email: string, _password?: string) => { // Password ignored for demo
    const newUser = { email };
    localStorage.setItem(AUTH_KEY, JSON.stringify(newUser));
    setUser(newUser);
    // In a real app, you'd call an API here
  }, []);

  const register = useCallback((email: string, _password?: string) => { // Password ignored
    const newUser = { email };
    // Simulate registration: in a real app, call API, then login or redirect.
    // For this demo, we'll just "log them in" by setting the user.
    localStorage.setItem(AUTH_KEY, JSON.stringify(newUser));
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_KEY);
    setUser(null);
  }, []);

  return { user, login, register, logout, isAuthenticated: !!user, isLoading };
}
