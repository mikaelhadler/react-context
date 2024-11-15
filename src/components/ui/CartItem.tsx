import React, { memo } from 'react';
import { CartItem as CartItemType } from '../../types';
import { formatCurrency } from '../../utils/testDataGenerator';
import PerformanceMonitor from '../../utils/performance';

interface CartItemProps {
  item: CartItemType;
  onRemove: (productId: number) => void;
}

const CartItem: React.FC<CartItemProps> = memo(({ item, onRemove }) => {
  PerformanceMonitor.recordRender(`CartItem-${item.product.id}`);

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div>
        <h4 className="font-medium">{item.product.name}</h4>
        <div className="text-sm text-gray-600">
          <p>{formatCurrency(item.product.price)} × {item.quantity}</p>
          <p className="font-medium">
            Total: {formatCurrency(item.product.price * item.quantity)}
          </p>
        </div>
      </div>
      <button
        onClick={() => onRemove(item.product.id)}
        className="px-3 py-1 text-red-500 hover:bg-red-50 rounded"
        aria-label={`Remove ${item.product.name} from cart`}
      >
        Remove
      </button>
    </div>
  );
});

CartItem.displayName = 'CartItem';
export default CartItem;