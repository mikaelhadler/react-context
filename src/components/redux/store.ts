import { configureStore, ThunkAction } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import userReducer from './slices/userSlice';
import cartReducer from './slices/cartSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Inferir os tipos do store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Criar versões tipadas dos hooks do Redux
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Tipos auxiliares para melhor type safety
export interface TypedDispatch<T> {
  <A extends { type: string }>(action: A): A;
  <R>(asyncAction: ThunkAction<R, RootState, unknown, any>): R;
}

export interface TypedThunkAction<R = void> {
  (dispatch: TypedDispatch<RootState>, getState: () => RootState): R;
}