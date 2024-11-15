import React, { memo } from 'react';
import { useAppDispatch, useAppSelector } from './redux/store';
import { removeFromCart } from './redux/slices/cartSlice';
import { selectCartWithDetails } from './redux/selectors';
import { useCart } from './context/CartContext';
import CartItem from './ui/CartItem';
import { formatCurrency } from '../utils/testDataGenerator';
import PerformanceMonitor from '../utils/performance';
import { CartItem as ICardItem } from '../interfaces';

interface Props {
  mode: 'context' | 'redux';
}

const Cart: React.FC<Props> = memo(({ mode }) => {
  const dispatch = useAppDispatch();
  const cartContext = useCart();
  
  // Redux state
  const { items: reduxItems, total: reduxTotal } = useAppSelector(selectCartWithDetails);
  
  // Context state
  const { items: contextItems, total: contextTotal } = cartContext;
  
  PerformanceMonitor.recordRender('Cart');

  const items = mode === 'redux' ? reduxItems : contextItems;
  const total = mode === 'redux' ? reduxTotal : contextTotal;

  const handleRemoveItem = (productId: number) => {
    if (mode === 'redux') {
      dispatch(removeFromCart(productId));
    } else {
      cartContext.removeFromCart(productId);
    }
  };

  if (items.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        Your cart is empty
      </div>
    );
  }

  return (
    <div className="border rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Shopping Cart</h2>
      </div>
      
      <div className="divide-y">
        {items.map((item: ICardItem) => (
          <CartItem
            key={item.product.id}
            item={item}
            onRemove={handleRemoveItem}
          />
        ))}
      </div>
      
      <div className="p-4 bg-gray-50">
        <div className="flex justify-between items-center">
          <span className="font-medium">Total:</span>
          <span className="text-xl font-bold">
            {formatCurrency(total)}
          </span>
        </div>
      </div>
    </div>
  );
});

Cart.displayName = 'Cart';
export default Cart;