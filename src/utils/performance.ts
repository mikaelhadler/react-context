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