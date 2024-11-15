import { useEffect, useRef } from 'react';
import { useAppSelector } from './store';
import PerformanceMonitor from '../../utils/performance';
import { RootState } from '../../types';

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
): { [K in keyof T]: ReturnType<T[K]> } => {
  return Object.keys(selectors).reduce(
    (acc, key) => ({
      ...acc,
      [key]: useAppSelector(selectors[key as keyof T]),
    }),
    {}
  ) as { [K in keyof T]: ReturnType<T[K]> };
};

// Hook para memoizar seletores complexos
export const createSelector = <T extends (state: RootState) => any>(
  selector: T,
  deps: any[] = []
) => {
  return (state: RootState): ReturnType<T> => {
    const memoizedSelector = useRef(selector);
    useEffect(() => {
      memoizedSelector.current = selector;
    }, deps);
    return memoizedSelector.current(state);
  };
};

// Tipos auxiliares para melhor type safety
type SelectorMap<T> = {
  [K in keyof T]: (state: RootState) => any;
};

type SelectorReturnTypes<T extends SelectorMap<T>> = {
  [K in keyof T]: ReturnType<T[K]>;
};