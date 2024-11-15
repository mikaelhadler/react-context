import React, { memo } from 'react';
import { Product } from '../../types';
import { formatCurrency } from '../../utils/testDataGenerator';
import PerformanceMonitor from '../../utils/performance';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = memo(({ product, onAddToCart }) => {
  PerformanceMonitor.recordRender(`ProductCard-${product.id}`);

  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold">{product.name}</h3>
      <div className="mt-2">
        <p className="text-gray-600">{formatCurrency(product.price)}</p>
        <p className="text-sm text-gray-500">Stock: {product.stock}</p>
        {product.rating && (
          <p className="text-sm text-yellow-600">Rating: {product.rating}⭐</p>
        )}
      </div>
      <button
        onClick={() => onAddToCart(product)}
        className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded 
                 hover:bg-blue-600 transition-colors"
        disabled={product.stock === 0}
      >
        {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
      </button>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';
export default ProductCard;