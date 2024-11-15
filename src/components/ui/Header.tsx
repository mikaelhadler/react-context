import React, { memo } from 'react';
import { useAppSelector } from '../redux/store';
import { selectCartItemCount } from '../redux/selectors';
import PerformanceMonitor from '../../utils/performance';

const Header: React.FC = memo(() => {
  PerformanceMonitor.recordRender('Header');
  const itemCount = useAppSelector(selectCartItemCount);

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Performance Demo
          </h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <span className="absolute -top-2 -right-2 bg-blue-500 text-white 
                             rounded-full w-5 h-5 flex items-center justify-center 
                             text-xs">
                {itemCount}
              </span>
              <button className="p-2">🛒</button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
});

Header.displayName = 'Header';
export default Header;