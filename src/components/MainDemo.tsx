import React, { useState, useCallback } from 'react';
import ProductList from './ProductList';
import Cart from './Cart';
import Layout from './Layout';
import { generateProducts } from '../utils/testDataGenerator';
import { Product } from '../types';

const MainDemo: React.FC = () => {
  const [mode, setMode] = useState<'context' | 'redux'>('context');
  const [products, setProducts] = useState<Product[]>(() => generateProducts(9));

  const handleModeChange = useCallback((newMode: 'context' | 'redux') => {
    setMode(newMode);
  }, []);

  const handleStressTest = useCallback((testProducts: Product[]) => {
    setProducts(prev => [...prev, ...testProducts]);
  }, []);

  return (
    <Layout mode={mode} onStressTest={handleStressTest}>
      <div className="mb-8 flex justify-center gap-4">
        <button
          onClick={() => handleModeChange('context')}
          className={`px-6 py-3 rounded-lg ${
            mode === 'context'
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700'
          }`}
        >
          Context API
        </button>
        <button
          onClick={() => handleModeChange('redux')}
          className={`px-6 py-3 rounded-lg ${
            mode === 'redux'
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700'
          }`}
        >
          Redux
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ProductList
            products={products}
            mode={mode}
          />
        </div>
        <div>
          <Cart mode={mode} />
        </div>
      </div>
    </Layout>
  );
};

export default MainDemo;