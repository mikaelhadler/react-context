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