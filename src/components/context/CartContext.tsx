import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartContextType, CartItem, Product } from '../../types';
import { useUser } from './UserContext';
import { simulateAPICall } from '../../utils/testDataGenerator';
import PerformanceMonitor from '../../utils/performance';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { user } = useUser();

  PerformanceMonitor.recordRender('CartProvider');

  useEffect(() => {
    const syncCart = async () => {
      if (user) {
        try {
          const cartData = await simulateAPICall<CartItem[]>('fetchCart', []);
          setItems(cartData);
        } catch (error) {
          console.error('Failed to sync cart:', error);
        }
      }
    };

    syncCart();
  }, [user]);

  const addToCart = (product: Product) => {
    setItems(current => {
      const existingItem = current.find(item => item.product.id === product.id);
      if (existingItem) {
        return current.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...current, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setItems(current => current.filter(item => item.product.id !== productId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider 
      value={{ items, addToCart, removeFromCart, clearCart, total }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};