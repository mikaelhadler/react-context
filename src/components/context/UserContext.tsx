import React, { createContext, useContext, useState } from 'react';
import { User, UserContextType } from '../../types';
import { simulateAPICall } from '../../utils/testDataGenerator';
import PerformanceMonitor from '../../utils/performance';

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  PerformanceMonitor.recordRender('UserProvider');

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const userData = await simulateAPICall<User>('login', {
        id: 1,
        name: 'John Doe',
        email
      });
      setUser(userData);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};