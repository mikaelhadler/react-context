import { RootState } from './store';
import { CartItem, User } from '../../types';

// Seletores para o carrinho
export const selectCartItems = (state: RootState): CartItem[] => state.cart.items;
export const selectCartLoading = (state: RootState): boolean => state.cart.loading;
export const selectCartError = (state: RootState): string | null => state.cart.error;

export const selectCartTotal = (state: RootState): number => 
  state.cart.items.reduce(
    (sum: number, item: CartItem) => sum + item.product.price * item.quantity,
    0
  );

export const selectCartItemCount = (state: RootState): number =>
  state.cart.items.reduce(
    (sum: number, item: CartItem) => sum + item.quantity, 
    0
  );

// Seletores para o usuário
export const selectUser = (state: RootState) => state.user.data;
export const selectUserLoading = (state: RootState) => state.user.loading;
export const selectUserError = (state: RootState) => state.user.error;

// Seletores compostos
export const selectCartWithDetails = (state: RootState) => ({
  items: selectCartItems(state),
  total: selectCartTotal(state),
  itemCount: selectCartItemCount(state),
  loading: selectCartLoading(state),
  error: selectCartError(state),
});

export const selectUserWithDetails = (state: RootState) => ({
  user: selectUser(state),
  loading: selectUserLoading(state),
  error: selectUserError(state),
});

// Tipos auxiliares para melhor type safety
interface CartWithDetails {
  items: CartItem[];
  total: number;
  itemCount: number;
  loading: boolean;
  error: string | null;
}

interface UserWithDetails {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Versão tipada dos seletores compostos
export const selectCartWithDetailsTyped = (state: RootState): CartWithDetails => ({
  items: selectCartItems(state),
  total: selectCartTotal(state),
  itemCount: selectCartItemCount(state),
  loading: selectCartLoading(state),
  error: selectCartError(state),
});

export const selectUserWithDetailsTyped = (state: RootState): UserWithDetails => ({
  user: selectUser(state),
  loading: selectUserLoading(state),
  error: selectUserError(state),
});