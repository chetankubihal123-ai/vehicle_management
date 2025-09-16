import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: User['role']) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API call
    setLoading(true);
    
    // Mock users for demo
    const mockUsers: User[] = [
      {
        id: '1',
        email: 'owner@fleet.com',
        name: 'Fleet Owner',
        role: 'fleet_owner',
        created_at: new Date().toISOString(),
      },
      {
        id: '2',
        email: 'driver@fleet.com',
        name: 'John Driver',
        role: 'driver',
        fleet_owner_id: '1',
        created_at: new Date().toISOString(),
      },
      {
        id: '3',
        email: 'personal@user.com',
        name: 'Personal User',
        role: 'personal',
        created_at: new Date().toISOString(),
      },
    ];

    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
    } else {
      throw new Error('Invalid credentials');
    }
    setLoading(false);
  };

  const register = async (email: string, password: string, name: string, role: User['role']) => {
    setLoading(true);
    
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      role,
      created_at: new Date().toISOString(),
    };

    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
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