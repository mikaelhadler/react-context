# Guia de Implementação Completo: Context API vs Redux Performance Demo

## 1. Setup Inicial

### 1.1. Criar o projeto
```bash
npx create-react-app performance-demo --template typescript
cd performance-demo
```

### 1.2. Instalar dependências
```bash
# Gerenciamento de Estado
npm install @reduxjs/toolkit react-redux @types/react-redux

# UI e Componentes 
yarn add tailwindcss postcss autoprefixer lucide-react recharts @radix-ui/react-alert-dialog clsx tailwind-merge
```

### 1.3. Configurar Tailwind CSS
```bash
npx tailwindcss init -p
```

Crie ou atualize os seguintes arquivos:

#### `tailwind.config.js`
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

#### `src/index.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

## 2. Estrutura de Pastas

Crie a seguinte estrutura de pastas:
```bash
mkdir -p src/components/debug && mkdir -p src/components/ui && mkdir -p src/components/context && mkdir -p src/components/redux/slices && mkdir -p src/examples && mkdir -p src/utils && mkdir -p src/types
```

## 3. Definição de Tipos

### Crie `src/types/index.ts`:
```typescript
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
```

## 4. Utilitários

### Crie `src/utils/testDataGenerator.ts`:
```typescript
import { Product, User } from '../types';

export const generateProducts = (count: number): Product[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Product ${i + 1}`,
    price: Math.floor(Math.random() * 100) + 1,
    stock: Math.floor(Math.random() * 20) + 1,
    category: ['Electronics', 'Clothing', 'Books', 'Food'][Math.floor(Math.random() * 4)],
    rating: (Math.random() * 5).toFixed(1),
    reviews: Math.floor(Math.random() * 100),
  }));
};

export const generateUser = (): User => ({
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
});

export const simulateNetworkDelay = async (minMs = 200, maxMs = 800): Promise<void> => {
  const delay = Math.random() * (maxMs - minMs) + minMs;
  await new Promise(resolve => setTimeout(resolve, delay));
};

export const simulateAPICall = async <T>(
  operation: string,
  data?: T,
  failureRate = 0.05
): Promise<T> => {
  await simulateNetworkDelay();
  
  if (Math.random() < failureRate) {
    throw new Error(`API Error: Failed to ${operation}`);
  }

  return data as T;
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
```

### Crie `src/utils/performance.ts`:
```typescript
import { PerformanceMetric } from '../types';

class PerformanceMonitor {
  private static metrics: Map<string, PerformanceMetric> = new Map();
  private static listeners: Set<(metrics: PerformanceMetric[]) => void> = new Set();

  static recordRender(componentName: string): void {
    const startTime = performance.now();
    const current = this.metrics.get(componentName) || {
      componentName,
      renderCount: 0,
      lastRenderTime: 0,
      averageRenderTime: 0,
    };

    const renderTime = performance.now() - startTime;
    const newAverage = 
      (current.averageRenderTime * current.renderCount + renderTime) / 
      (current.renderCount + 1);

    const updated = {
      ...current,
      renderCount: current.renderCount + 1,
      lastRenderTime: renderTime,
      averageRenderTime: newAverage,
    };

    this.metrics.set(componentName, updated);
    this.notifyListeners();
  }

  static subscribe(listener: (metrics: PerformanceMetric[]) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  static getMetrics(): PerformanceMetric[] {
    return Array.from(this.metrics.values());
  }

  private static notifyListeners(): void {
    const metrics = this.getMetrics();
    this.listeners.forEach(listener => listener(metrics));
  }

  static reset(): void {
    this.metrics.clear();
    this.notifyListeners();
  }
}

export default PerformanceMonitor;
```

## 5. Implementação do Context

### Crie `src/components/context/UserContext.tsx`:
```typescript
import React, { createContext, useContext, useState } from 'react';
import { User, UserContextType } from '../../types';
import { simulateAPICall } from '../../utils/testDataGenerator';
import PerformanceMonitor from '../../utils/performance';

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  PerformanceMonitor.recordRender('UserProvider');

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const userData = await simulateAPICall<User>('login', {
        id: 1,
        name: 'John Doe',
        email
      });
      setUser(userData);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
```

### Crie `src/components/context/CartContext.tsx`:
```typescript
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartContextType, CartItem, Product } from '../../types';
import { useUser } from './UserContext';
import { simulateAPICall } from '../../utils/testDataGenerator';
import PerformanceMonitor from '../../utils/performance';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { user } = useUser();

  PerformanceMonitor.recordRender('CartProvider');

  useEffect(() => {
    const syncCart = async () => {
      if (user) {
        try {
          const cartData = await simulateAPICall<CartItem[]>('fetchCart', []);
          setItems(cartData);
        } catch (error) {
          console.error('Failed to sync cart:', error);
        }
      }
    };

    syncCart();
  }, [user]);

  const addToCart = (product: Product) => {
    setItems(current => {
      const existingItem = current.find(item => item.product.id === product.id);
      if (existingItem) {
        return current.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...current, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setItems(current => current.filter(item => item.product.id !== productId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider 
      value={{ items, addToCart, removeFromCart, clearCart, total }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
```

## 6. Implementação do Redux

### Crie `src/components/redux/slices/userSlice.ts`:
```typescript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { UserState, User } from '../../../types';
import { simulateAPICall } from '../../../utils/testDataGenerator';

export const loginUser = createAsyncThunk(
  'user/login',
  async (credentials: { email: string; password: string }) => {
    return simulateAPICall<User>('login', {
      id: 1,
      name: 'John Doe',
      email: credentials.email
    });
  }
);

const initialState: UserState = {
  data: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to login';
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
```

### Crie `src/components/redux/slices/cartSlice.ts`:
```typescript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { CartState, CartItem, Product } from '../../../types';
import { simulateAPICall } from '../../../utils/testDataGenerator';

export const fetchCart = createAsyncThunk(
  'cart/fetch',
  async (userId: number) => {
    return simulateAPICall<CartItem[]>('fetchCart', []);
  }
);

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: { payload: Product }) => {
      const existingItem = state.items.find(
        item => item.product.id === action.payload.id
      );
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ product: action.payload, quantity: 1 });
      }
    },
    removeFromCart: (state, action: { payload: number }) => {
      state.items = state.items.filter(
        item => item.product.id !== action.payload
      );
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch cart';
      });
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
```

### Continuação de `src/components/redux/store.ts`:
```typescript
import { configureStore } from '@reduxjs/toolkit';
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

export type RootState = ReturnType;
export type AppDispatch = typeof store.dispatch;

// hooks tipados para usar com o Redux
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

export const useAppDispatch = () => useDispatch();
export const useAppSelector: TypedUseSelectorHook = useSelector;
```

### Crie `src/components/redux/hooks.ts`:
```typescript
import { useEffect, useRef } from 'react';
import { useAppSelector } from './store';
import PerformanceMonitor from '../../utils/performance';

// Hook para monitorar re-renders do Redux
export const useReduxMonitor = (componentName: string) => {
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
    PerformanceMonitor.recordRender(componentName);
  });

  return renderCount.current;
};

// Hook para selecionar múltiplos estados do Redux de forma otimizada
export const useMultiSelector = <T extends Record<string, (state: RootState) => any>>(
  selectors: T
): { [K in keyof T]: ReturnType } => {
  return Object.keys(selectors).reduce(
    (acc, key) => ({
      ...acc,
      [key]: useAppSelector(selectors[key as keyof T]),
    }),
    {}
  ) as { [K in keyof T]: ReturnType };
};

// Hook para memoizar seletores complexos
export const createSelector = <T extends (state: RootState) => any>(
  selector: T,
  deps: any[] = []
) => {
  return (state: RootState) => {
    const memoizedSelector = useRef(selector);
    useEffect(() => {
      memoizedSelector.current = selector;
    }, deps);
    return memoizedSelector.current(state);
  };
};
```

### Crie `src/components/redux/selectors.ts`:
```typescript
import { RootState } from './store';
import { CartItem } from '../../types';

// Seletores para o carrinho
export const selectCartItems = (state: RootState): CartItem[] => state.cart.items;
export const selectCartLoading = (state: RootState): boolean => state.cart.loading;
export const selectCartError = (state: RootState): string | null => state.cart.error;

export const selectCartTotal = (state: RootState): number => 
  state.cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

export const selectCartItemCount = (state: RootState): number =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);

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
```

## 7. Implementação dos Componentes UI Base

### Crie `src/components/ui/ProductCard.tsx`:
```typescript
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
```

### Crie `src/components/ui/CartItem.tsx`:
```typescript
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
```

### Crie `src/components/ui/LoadingSpinner.tsx`:
```typescript
import React from 'react';

const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center p-4">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
  </div>
);

export default LoadingSpinner;
```

### Crie `src/components/ui/ErrorBoundary.tsx`:
```typescript
import React, { Component, ErrorInfo } from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 border border-red-200 rounded bg-red-50">
          <h2 className="text-lg font-semibold text-red-700">
            Something went wrong
          </h2>
          <p className="text-red-600 mt-2">
            {this.state.error?.message || 'Unknown error occurred'}
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

### Crie `src/components/ui/Header.tsx`:
```typescript
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
```


## 8. Implementação dos Componentes de Debug

### Crie `src/components/debug/PerformanceMetrics.tsx`:
```typescript
import React, { memo, useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { PerformanceMetric } from '../../types';
import PerformanceMonitor from '../../utils/performance';

interface Props {
  componentName: string;
  parentName?: string;
}

const PerformanceMetrics: React.FC = memo(({ componentName, parentName }) => {
  const [metrics, setMetrics] = useState([]);
  const [history, setHistory] = useState<Array>([]);

  useEffect(() => {
    const unsubscribe = PerformanceMonitor.subscribe((newMetrics) => {
      const componentMetric = newMetrics.find(m => m.componentName === componentName);
      if (componentMetric) {
        setMetrics([componentMetric]);
        setHistory(prev => [
          ...prev,
          {
            time: Date.now(),
            renderTime: componentMetric.lastRenderTime
          }
        ].slice(-20)); // Keep last 20 data points
      }
    });

    return unsubscribe;
  }, [componentName]);

  const currentMetric = metrics[0];

  return (
    
      
        {componentName}
        {parentName && (
          Parent: {parentName}
        )}
      

      
        
          Render Count
          
            {currentMetric?.renderCount || 0}
          
        
        
        
          Avg Render Time
          
            {currentMetric?.averageRenderTime.toFixed(2) || '0.00'}ms
          
        
      

      
        
          
          <XAxis 
            dataKey="time" 
            tickFormatter={(value) => new Date(value).toLocaleTimeString()} 
          />
          
          <Tooltip 
            labelFormatter={(value) => new Date(value).toLocaleTimeString()}
            formatter={(value: number) => [`${value.toFixed(2)}ms`, 'Render Time']}
          />
          
        
      
    
  );
});

PerformanceMetrics.displayName = 'PerformanceMetrics';
export default PerformanceMetrics;
```

### Crie `src/components/debug/StateTree.tsx`:
```typescript
import React, { memo, useState } from 'react';

interface Props {
  data: any;
  name?: string;
  level?: number;
}

const StateTree: React.FC = memo(({ data, name = 'root', level = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  const renderValue = (value: any) => {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (typeof value === 'object') {
      return ;
    }
    return String(value);
  };

  if (typeof data !== 'object' || data === null) {
    return (
      
        {name}: {String(data)}
      
    );
  }

  return (
    
      <div
        className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? '▼' : '▶'}
        {name}
      
      {isExpanded && (
        
          {Object.entries(data).map(([key, value]) => (
            
              {renderValue(value)}
            
          ))}
        
      )}
    
  );
});

StateTree.displayName = 'StateTree';
export default StateTree;
```

### Crie `src/components/debug/StressTest.tsx`:
```typescript
import React, { memo, useState, useCallback } from 'react';
import { Product } from '../../types';
import { generateProducts } from '../../utils/testDataGenerator';

interface Props {
  onStressTest: (products: Product[]) => void;
}

const StressTest: React.FC = memo(({ onStressTest }) => {
  const [intensity, setIntensity] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const [duration, setDuration] = useState(5);

  const handleStartStress = useCallback(() => {
    setIsRunning(true);
    
    const startTime = Date.now();
    const interval = setInterval(() => {
      const products = generateProducts(intensity);
      onStressTest(products);
      
      if (Date.now() - startTime >= duration * 1000) {
        clearInterval(interval);
        setIsRunning(false);
      }
    }, 1000 / intensity);

    return () => clearInterval(interval);
  }, [intensity, duration, onStressTest]);

  return (
    
      Stress Test Controls
      
      
        
          
            Intensity (operations/second)
          
          <input
            type="range"
            min="1"
            max="20"
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
            className="w-full mt-1"
          />
          {intensity} ops/sec
        

        
          
            Duration (seconds)
          
          <input
            type="range"
            min="1"
            max="10"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full mt-1"
          />
          {duration} seconds
        

        
          {isRunning ? 'Running...' : 'Start Stress Test'}
        
      
    
  );
});

StressTest.displayName = 'StressTest';
export default StressTest;
```

### Crie `src/components/debug/EnhancedDebugPanel.tsx`:
```typescript
import React, { memo, useState } from 'react';
import { useAppSelector } from '../redux/store';
import PerformanceMetrics from './PerformanceMetrics';
import StateTree from './StateTree';
import StressTest from './StressTest';
import { Product } from '../../types';

interface Props {
  mode: 'context' | 'redux';
  onStressTest: (products: Product[]) => void;
}

const EnhancedDebugPanel: React.FC = memo(({ mode, onStressTest }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState('metrics');
  
  const reduxState = useAppSelector(state => state);

  const tabs = [
    { id: 'metrics', label: 'Performance Metrics' },
    { id: 'state', label: 'State Tree' },
    { id: 'stress', label: 'Stress Test' },
  ] as const;

  return (
    
      
        
          
            {isExpanded ? 'Debug Panel' : '🔧'}
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-500 hover:text-gray-700"
          >
            {isExpanded ? '◀' : '▶'}
          
        

        {isExpanded && (
          
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 rounded ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {tab.label}
              
            ))}
          
        )}
      

      {isExpanded && (
        
          {activeTab === 'metrics' && (
            
              
              
              
            
          )}

          {activeTab === 'state' && (
            
              <StateTree
                data={mode === 'redux' ? reduxState : { context: 'Context state view not available' }}
                name={mode === 'redux' ? 'Redux Store' : 'Context'}
              />
            
          )}

          {activeTab === 'stress' && (
            
          )}
        
      )}
    
  );
});

EnhancedDebugPanel.displayName = 'EnhancedDebugPanel';
export default EnhancedDebugPanel;
```

## 9. Implementação dos Componentes Principais

### Crie `src/components/ProductList.tsx`:
```typescript
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
```

### Crie `src/components/Cart.tsx`:
```typescript
import React, { memo } from 'react';
import { useAppDispatch, useAppSelector } from './redux/store';
import { removeFromCart } from './redux/slices/cartSlice';
import { selectCartWithDetails } from './redux/selectors';
import { useCart } from './context/CartContext';
import CartItem from './ui/CartItem';
import { formatCurrency } from '../utils/testDataGenerator';
import PerformanceMonitor from '../utils/performance';

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
        {items.map(item => (
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
```

### Crie `src/components/Layout.tsx`:
```typescript
import React, { memo } from 'react';
import Header from './ui/Header';
import { EnhancedDebugPanel } from './debug/EnhancedDebugPanel';
import { Product } from '../types';

interface Props {
  children: React.ReactNode;
  mode: 'context' | 'redux';
  onStressTest: (products: Product[]) => void;
}

const Layout: React.FC<Props> = memo(({ children, mode, onStressTest }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      <EnhancedDebugPanel
        mode={mode}
        onStressTest={onStressTest}
      />
    </div>
  );
});

Layout.displayName = 'Layout';
export default Layout;
```

### Crie `src/components/MainDemo.tsx`:
```typescript
import React, { useState, useCallback } from 'react';
import ProductList from './ProductList';
import Cart from './Cart';
import Layout from './Layout';
import { generateProducts } from '../utils/testDataGenerator';
import { Product } from '../types';

const MainDemo: React.FC = () => {
  const [mode, setMode] = useState<'context' | 'redux'>('context');
  const [products, setProducts] = useState<Product[]>(() => generateProducts(9));

  const handleModeChange = useCallback((newMode: 'context' | 'redux') => {
    setMode(newMode);
  }, []);

  const handleStressTest = useCallback((testProducts: Product[]) => {
    setProducts(prev => [...prev, ...testProducts]);
  }, []);

  return (
    <Layout mode={mode} onStressTest={handleStressTest}>
      <div className="mb-8 flex justify-center gap-4">
        <button
          onClick={() => handleModeChange('context')}
          className={`px-6 py-3 rounded-lg ${
            mode === 'context'
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700'
          }`}
        >
          Context API
        </button>
        <button
          onClick={() => handleModeChange('redux')}
          className={`px-6 py-3 rounded-lg ${
            mode === 'redux'
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700'
          }`}
        >
          Redux
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ProductList
            products={products}
            mode={mode}
          />
        </div>
        <div>
          <Cart mode={mode} />
        </div>
      </div>
    </Layout>
  );
};

export default MainDemo;
```

### Atualize `src/App.tsx`:
```typescript
import React from 'react';
import { Provider } from 'react-redux';
import { store } from './components/redux/store';
import { UserProvider } from './components/context/UserContext';
import { CartProvider } from './components/context/CartContext';
import MainDemo from './components/MainDemo';
import ErrorBoundary from './components/ui/ErrorBoundary';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <UserProvider>
          <CartProvider>
            <MainDemo />
          </CartProvider>
        </UserProvider>
      </Provider>
    </ErrorBoundary>
  );
};

export default App;
```

### Atualize `src/index.tsx`:
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

## 10. Scripts para package.json

Atualize seu `package.json` com os seguintes scripts:

```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "analyze": "source-map-explorer 'build/static/js/*.js'"
  }
}
```

## 11. Executando o Projeto

1. Certifique-se de que todas as dependências estão instaladas:
```bash
npm install
```

2. Inicie o servidor de desenvolvimento:
```bash
npm start
```

3. Acesse `http://localhost:3000` no navegador

4. Use o painel de debug para:
   - Comparar performance entre Context API e Redux
   - Executar testes de stress
   - Visualizar a árvore de estado
   - Monitorar métricas de performance

Este exemplo demonstrará claramente:
- Re-renders desnecessários no Context API
- Performance otimizada do Redux
- Impacto de diferentes padrões de atualização de estado
- Diferenças de escalabilidade entre as abordagens
