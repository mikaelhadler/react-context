import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartState, Product } from '../../../types';

interface UpdateQuantityPayload {
  productId: number;
  quantity: number;
}

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
  visibleProducts: true,
  filter: null
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const existingItem = state.items.find(item => item.product.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ product: action.payload, quantity: 1 });
      }
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.product.id !== action.payload);
    },
    updateCartItemQuantity: (state, action: PayloadAction<UpdateQuantityPayload>) => {
      const item = state.items.find(item => item.product.id === action.payload.productId);
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },
    toggleProductVisibility: (state) => {
      state.visibleProducts = !state.visibleProducts;
    },
    setProductFilter: (state, action: PayloadAction<string>) => {
      state.filter = action.payload;
    },
    clearCart: (state) => {
      state.items = [];
    }
  }
});

export const {
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  toggleProductVisibility,
  setProductFilter,
  clearCart
} = cartSlice.actions;

export default cartSlice.reducer;