import React, { memo, useState } from "react";
import { useAppSelector, useAppDispatch } from "../redux/store";
import {
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  toggleProductVisibility,
  setProductFilter,
} from "../redux/slices/cartSlice";
import PerformanceMetrics from "./PerformanceMetrics";
import StateTree from "./StateTree";
import StressTest from "./StressTest";
import { Product } from "../../types";
import {
  CartProps,
  EnhancedDebugPanelProps,
  RootState,
  StressAction,
  StressTestResult,
} from "../../interfaces";

const EnhancedDebugPanel: React.FC<EnhancedDebugPanelProps> = memo(
  ({ mode, onStressTest }) => {
    const dispatch = useAppDispatch();
    const reduxState = useAppSelector((state: RootState) => state);
    const [isTestRunning, setIsTestRunning] = useState(false);
    // ... outros estados


    const handleStressTestResults = (results: StressTestResult[]) => {
      // Analisar e exibir resultados
      const analyzeResults = () => {
        const byAction = results.reduce((acc, result) => {
          const { action, renderTime } = result;
          if (!acc[action.type]) {
            acc[action.type] = {
              count: 0,
              totalTime: 0,
              maxTime: 0,
              minTime: Infinity,
            };
          }

          acc[action.type].count++;
          acc[action.type].totalTime += renderTime;
          acc[action.type].maxTime = Math.max(
            acc[action.type].maxTime,
            renderTime
          );
          acc[action.type].minTime = Math.min(
            acc[action.type].minTime,
            renderTime
          );

          return acc;
        }, {} as Record<string, any>);

        return Object.entries(byAction).map(([action, stats]) => ({
          action,
          averageTime: stats.totalTime / stats.count,
          maxTime: stats.maxTime,
          minTime: stats.minTime,
          count: stats.count,
        }));
      };

      setStressMetrics((prev) => ({
        ...prev,
        results: analyzeResults(),
        totalOperations: results.length,
        averageRenderTime:
          results.reduce((sum, r) => sum + r.renderTime, 0) / results.length,
      }));
    };

    // Função auxiliar para obter os itens atuais baseado no modo
    const getCurrentItems = () => {
      return mode === "redux" ? reduxState.cart.items : cartContext.items;
    };

    // Função auxiliar para obter o estado atual baseado no modo
    const getCurrentState = () => {
      return mode === "redux"
        ? reduxState
        : {
            cart: {
              items: cartContext.items,
              total: cartContext.total,
            },
          };
    };


    const handleStressTest = async (action: StressAction, products?: Product[]) => {
      setIsTestRunning(true);
      const startTime = performance.now();
  
      try {
        if (mode === 'redux') {
          // Redux actions
          switch (action.type) {
            case 'add':
              if (products) {
                products.forEach(product => {
                  dispatch(addToCart(product));
                  onStressTest(product); // Notifica o componente pai
                });
              }
              break;
            case 'remove':
              const reduxItems = reduxState.cart.items;
              if (reduxItems.length > 0) {
                const randomIndex = Math.floor(Math.random() * reduxItems.length);
                const itemToRemove = reduxItems[randomIndex];
                dispatch(removeFromCart(itemToRemove.product.id));
                onStressTest(itemToRemove.product);
              }
              break;
            // ... outras actions do Redux
          }
        } else {
          // Context actions
          switch (action.type) {
            case 'add':
              if (products) {
                products.forEach(product => {
                  cartContext.addToCart(product);
                  onStressTest(product);
                });
              }
              break;
            case 'remove':
              const contextItems = cartContext.items;
              if (contextItems.length > 0) {
                const randomIndex = Math.floor(Math.random() * contextItems.length);
                const itemToRemove = contextItems[randomIndex];
                cartContext.removeFromCart(itemToRemove.product.id);
                onStressTest(itemToRemove.product);
              }
              break;
            // ... outras actions do Context
          }
        }
  
        const endTime = performance.now();
        const renderTime = endTime - startTime;
  
        // Atualiza os resultados do teste
        setTestResults(prev => [...prev, {
          action,
          renderTime,
          memoryUsage: (window.performance as any)?.memory?.usedJSHeapSize || 0,
          timestamp: Date.now()
        }]);
  
        // Atualiza as métricas
        setMetrics(prev => ({
          ...prev,
          renderTime: [...prev.renderTime, renderTime],
          totalOperations: prev.totalOperations + 1,
          averageRenderTime: (prev.averageRenderTime * prev.totalOperations + renderTime) / (prev.totalOperations + 1)
        }));
  
      } finally {
        setIsTestRunning(false);
      }
    };

    return (
      // ... resto do JSX
      <div className="p-4 border rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">
        Stress Test ({mode === 'redux' ? 'Redux' : 'Context API'})
      </h3>
      <StressTest 
        onStressTest={handleStressTest}
        isRunning={isTestRunning}
        onResults={handleStressResults}
        mode={mode}
        currentItems={getCurrentItems()}
      />
      
      {/* Mostrar estado atual */}
      <div className="mt-4">
        <h4 className="text-md font-medium mb-2">Current State</h4>
        <StateTree
          data={getCurrentState()}
          name={mode === 'redux' ? 'Redux Store' : 'Context State'}
        />
      </div>
    </div>
      // ... resto do JSX
    );
  }
);

export default EnhancedDebugPanel;
