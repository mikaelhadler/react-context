import React, { memo } from 'react';
import Header from './ui/Header';
import EnhancedDebugPanel from './debug/EnhancedDebugPanel';
import { Product } from '../types';

interface Props {
  children: React.ReactNode;
  mode: 'context' | 'redux';
  onStressTest: (products: Product[]) => void;
}

const Layout: React.FC<Props> = memo(({ children, mode, onStressTest }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      <EnhancedDebugPanel
        mode={mode}
        onStressTest={onStressTest}
      />
    </div>
  );
});

Layout.displayName = 'Layout';
export default Layout;