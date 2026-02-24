import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (phone: string, role: User['role']) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('elevator_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (phone: string, role: User['role']) => {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: `User ${phone}`,
      role: role
    };
    setUser(newUser);
    localStorage.setItem('elevator_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('elevator_user');
  };

  const value = useMemo(() => ({ user, login, logout, isLoading }), [user, isLoading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
