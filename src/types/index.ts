// src/types/index.ts

// Tipos básicos
export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category?: string;
  rating?: string;
  reviews?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

// Tipos para métricas de performance
export interface PerformanceMetric {
  componentName: string;
  renderCount: number;
  lastRenderTime: number;
  averageRenderTime: number;
}

// Tipos para o estado do Redux
export interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
  visibleProducts: boolean;
  filter: string | null;
}

export interface UserState {
  data: User | null;
  loading: boolean;
  error: string | null;
}

export interface RootState {
  cart: CartState;
  user: UserState;
}

// Tipos para os contexts
export interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  total: number;
}

export interface UserContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Tipos para actions do Redux
export interface AddToCartAction {
  type: 'cart/addToCart';
  payload: Product;
}

export interface RemoveFromCartAction {
  type: 'cart/removeFromCart';
  payload: number;
}

export interface ClearCartAction {
  type: 'cart/clearCart';
}

export interface SetUserAction {
  type: 'user/setUser';
  payload: User;
}

export interface SetLoadingAction {
  type: 'user/setLoading';
  payload: boolean;
}

export interface SetErrorAction {
  type: 'user/setError';
  payload: string;
}

// Union types para actions
export type CartActionTypes = 
  | AddToCartAction 
  | RemoveFromCartAction 
  | ClearCartAction;

export type UserActionTypes = 
  | SetUserAction 
  | SetLoadingAction 
  | SetErrorAction;

// Tipo para modo
export type ModeType = 'context' | 'redux';

// Tipos para eventos e handlers
export type EventHandlers = {
  onModeChange(mode: ModeType): void;
  onStressTest(products: Product[]): void;
  onAddToCart(product: Product): void;
  onRemoveFromCart(productId: number): void;
  onClearCart(): void;
  onLogin(email: string, password: string): Promise<void>;
  onLogout(): void;
};

// Tipos para configurações
export interface Config {
  apiBaseUrl: string;
  defaultStressTestDuration: number;
  maxStressTestIntensity: number;
  performanceThresholds: {
    renderTime: number;
    maxRenders: number;
  };
}

// Tipos para testes
export interface TestCase {
  description: string;
  input: any;
  expectedOutput: any;
}

export interface PerformanceTestResult {
  mode: ModeType;
  averageRenderTime: number;
  totalRenders: number;
  memoryUsage: number;
  timestamp: number;
}

// Tipos utilitários
export interface AsyncResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export interface PaginationParams {
  page: number;
  limit: number;
  total: number;
}

export interface SortParams {
  field: string;
  direction: 'asc' | 'desc';
}

// Tipos para componentes específicos
export interface PerformanceMetricsProps {
  componentName: string;
  renderCount: number;
  lastRenderTime: number;
  averageRenderTime: number;
}

export interface StateTreeProps {
  data: any;
  name?: string;
  level?: number;
}

export interface StressTestProps {
  onStressTest: (products: Product[]) => void;
  duration?: number;
  intensity?: number;
}