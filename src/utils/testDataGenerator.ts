import { Product, User } from '../types';

export const generateProducts = (count: number): Product[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Product ${i + 1}`,
    price: Math.floor(Math.random() * 100) + 1,
    stock: Math.floor(Math.random() * 20) + 1,
    category: ['Electronics', 'Clothing', 'Books', 'Food'][Math.floor(Math.random() * 4)],
    rating: (Math.random() * 5).toFixed(1),
    reviews: Math.floor(Math.random() * 100),
  }));
};

export const generateUser = (): User => ({
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
});

export const simulateNetworkDelay = async (minMs = 200, maxMs = 800): Promise<void> => {
  const delay = Math.random() * (maxMs - minMs) + minMs;
  await new Promise(resolve => setTimeout(resolve, delay));
};

export const simulateAPICall = async <T>(
  operation: string,
  data?: T,
  failureRate = 0.05
): Promise<T> => {
  await simulateNetworkDelay();
  
  if (Math.random() < failureRate) {
    throw new Error(`API Error: Failed to ${operation}`);
  }

  return data as T;
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};