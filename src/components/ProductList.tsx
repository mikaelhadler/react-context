import React, { memo } from 'react';
import { Product } from '../types';
import ProductCard from './ui/ProductCard';
import { useAppDispatch, useAppSelector } from './redux/store';
import { addToCart } from './redux/slices/cartSlice';
import { selectCartItems } from './redux/selectors';
import { useCart } from './context/CartContext';
import PerformanceMonitor from '../utils/performance';

interface Props {
  products: Product[];
  mode: 'context' | 'redux';
}

const ProductList: React.FC<Props> = memo(({ products, mode }) => {
  const dispatch = useAppDispatch();
  const cartContext = useCart();
  
  PerformanceMonitor.recordRender('ProductList');

  const handleAddToCart = (product: Product) => {
    if (mode === 'redux') {
      dispatch(addToCart(product));
    } else {
      cartContext.addToCart(product);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={handleAddToCart}
        />
      ))}
    </div>
  );
});

ProductList.displayName = 'ProductList';
export default ProductList;