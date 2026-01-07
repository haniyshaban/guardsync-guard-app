import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Guard } from '@/types/guard';

interface AuthContextType {
  guard: Guard | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithFace: () => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockGuard: Guard = {
  id: '1',
  name: 'Rajesh Kumar',
  email: 'rajesh.kumar@guardwise.com',
  employeeId: 'GW-2024-0147',
  phone: '+91 98765 43210',
  status: 'off-duty',
  currentShift: {
    id: 's1',
    date: new Date().toISOString().split('T')[0],
    startTime: '08:00',
    endTime: '16:00',
    location: 'Tech Park - Building A',
    status: 'scheduled',
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [guard, setGuard] = useState<Guard | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (email && password) {
      setGuard(mockGuard);
      return true;
    }
    return false;
  };

  const loginWithFace = async (): Promise<boolean> => {
    // Simulate facial recognition
    await new Promise((resolve) => setTimeout(resolve, 2500));
    setGuard(mockGuard);
    return true;
  };

  const logout = () => {
    setGuard(null);
  };

  return (
    <AuthContext.Provider
      value={{
        guard,
        isAuthenticated: !!guard,
        login,
        loginWithFace,
        logout,
      }}
    >
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
