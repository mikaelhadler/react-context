// src/types/index.ts
import { Product, CartState, ModeType } from '../types'
// Tipos básicos da aplicação export interface Product { id: number; name: string; price: number; stock: number; category?: string; rating?: string; reviews?: number; }

export interface CartItem { product: Product; quantity: number; }

export interface User { id: number; name: string; email: string; }

// Tipos para o Context export interface UserContextType { user: User | null; loading: boolean; error: string | null; login: (email: string, password: string) => Promise; logout: () => void; }

export interface CartContextType { items: CartItem[]; loading: boolean; error: string | null; addToCart: (product: Product) => void; removeFromCart: (productId: number) => void; clearCart: () => void; total: number; }

// Tipos para o Redux export interface CartState { items: CartItem[]; loading: boolean; error: string | null; }

export interface UserState { data: User | null; loading: boolean; error: string | null; }

export interface RootState { cart: CartState; user: UserState; }

// Tipos para ações do Redux export interface AddToCartAction { type: 'cart/addToCart'; payload: Product; }

export interface RemoveFromCartAction { type: 'cart/removeFromCart'; payload: number; }

export interface ClearCartAction { type: 'cart/clearCart'; }

export interface SetUserAction { type: 'user/setUser'; payload: User; }

export interface SetLoadingAction { type: 'user/setLoading'; payload: boolean; }

export interface SetErrorAction { type: 'user/setError'; payload: string; }

export interface AddToCartAction {
  type: 'cart/addToCart';
  payload: Product;
}

export type CartActionTypes = AddToCartAction | RemoveFromCartAction | ClearCartAction;

export type UserActionTypes = SetUserAction | SetLoadingAction | SetErrorAction;

// Tipos para componentes export interface ProductCardProps { product: Product; onAddToCart: (product: Product) => void; }

export interface CartItemProps { item: CartItem; onRemove: (productId: number) => void; }

export interface LayoutProps { children: React.ReactNode; mode: 'context' | 'redux'; onStressTest: (products: Product[]) => void; }

// Tipos para métricas de performance export interface PerformanceMetric { componentName: string; renderCount: number; lastRenderTime: number; averageRenderTime: number; renderHistory: RenderHistoryEntry[]; }

export interface RenderHistoryEntry { timestamp: number; renderTime: number; }

export interface PerformanceMetricsProps { componentName: string; parentName?: string; }

// Tipos para o Debug Panel export interface StateTreeProps { data: any; name?: string; level?: number; }

export interface StressTestProps { onStressTest: (products: Product[]) => void; }

export interface EnhancedDebugPanelProps { mode: 'context' | 'redux'; onStressTest: (products: Product[]) => void; }

// Tipos para os hooks personalizados export interface UseMultiSelectorResult { [K in keyof T]: ReturnType<T[K]>; }

export interface UsePerfMonitorResult { renderCount: number; lastRenderTime: number; averageRenderTime: number; }

// Tipos para utilitários export interface APIResponse { data: T; success: boolean; error?: string; }

export interface SimulateAPICallOptions { delay?: number; failureRate?: number; }

// Tipos para componentes principais export interface ProductListProps { products: Product[]; mode: 'context' | 'redux'; }

export interface CartProps { mode: 'context' | 'redux'; }

export interface HeaderProps { cartItemCount: number; userName?: string; }

// Tipos para Error Boundary export interface ErrorBoundaryState { hasError: boolean; error: Error | null; }

export interface ErrorBoundaryProps { children: React.ReactNode; fallback?: React.ReactNode; }

// Tipos para os selectors do Redux export interface CartSelectors { selectCartItems: (state: RootState) => CartItem[]; selectCartTotal: (state: RootState) => number; selectCartItemCount: (state: RootState) => number; selectCartLoading: (state: RootState) => boolean; selectCartError: (state: RootState) => string | null; }

export interface UserSelectors { selectUser: (state: RootState) => User | null; selectUserLoading: (state: RootState) => boolean; selectUserError: (state: RootState) => string | null; }

// Tipos para as thunks do Redux export interface LoginThunkArg { email: string; password: string; }

export interface FetchCartThunkArg { userId: number; }

// Tipos para o estado combinado export interface CombinedCartState { items: CartItem[]; total: number; itemCount: number; loading: boolean; error: string | null; }

export interface CombinedUserState { user: User | null; loading: boolean; error: string | null; }

// Tipos para eventos e handlers export type ModeType = 'context' | 'redux';

// export interface EventHandlers { onModeChange: (mode: ModeType) => void; onStressTest: (products: Product[]) => void; onAddToCart: (product: Product) => void; onRemoveFromCart: (productId: number) => void; onClearCart: () => void; onLogin: (email: string, password: string) => Promise; onLogout: () => void; }

// Tipos para configurações export interface Config { apiBaseUrl: string; defaultStressTestDuration: number; maxStressTestIntensity: number; performanceThresholds: { renderTime: number; maxRenders: number; }; }

// Tipos para testes export interface TestCase { description: string; input: any; expectedOutput: any; }

export interface PerformanceTestResult { mode: ModeType; averageRenderTime: number; totalRenders: number; memoryUsage: number; timestamp: number; }

export type EventHandlers = {
  onModeChange(mode: ModeType): void;
  onStressTest(products: Product[]): void;
  onAddToCart(product: Product): void;
  onRemoveFromCart(productId: number): void;
  onClearCart(): void;
  onLogin(email: string, password: string): Promise<void>;
  onLogout(): void;
};


export interface StressAction {
  type: 'add' | 'remove' | 'update' | 'toggle' | 'filter';
  description: string;
}

export interface StressTestConfig {
  intensity: number;
  duration: number;
  actions: StressAction[];
}

export interface StressTestResult {
  action: StressAction;
  renderTime: number;
  memoryUsage: number;
  timestamp: number;
}