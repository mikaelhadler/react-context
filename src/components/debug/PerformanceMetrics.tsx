import React, { memo, useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { PerformanceMetric } from '../../types';
import PerformanceMonitor from '../../utils/performance';

interface Props {
  componentName: string;
  parentName?: string;
}

const PerformanceMetrics: React.FC<Props> = memo(({ componentName, parentName }) => {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [history, setHistory] = useState<Array<{ time: number; renderTime: number }>>([]);


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
    <div className="performance-metrics">
      <div className="metrics-header">
        <h3>{componentName}</h3>
        {parentName && (
          <p>Parent: {parentName}</p>
        )}
      </div>

      <div className="metrics-content">
        <div className="metric-item">
          <span>Render Count:</span>
          <span>{currentMetric?.renderCount || 0}</span>
        </div>
        <div className="metric-item">
          <span>Avg Render Time:</span>
          <span>{currentMetric?.averageRenderTime.toFixed(2) || '0.00'}ms</span>
        </div>
      </div>

      <div className="chart-container">
        <LineChart width={300} height={150} data={history}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="time" 
            tickFormatter={(value) => new Date(value).toLocaleTimeString()} 
          />
          <YAxis />
          <Tooltip 
            labelFormatter={(value) => new Date(value).toLocaleTimeString()}
            formatter={(value: number) => [`${value.toFixed(2)}ms`, 'Render Time']}
          />
          <Line
            type="monotone"
            dataKey="renderTime"
            stroke="#8884d8"
            isAnimationActive={false}
          />
        </LineChart>
      </div>
    </div>
  );
});

PerformanceMetrics.displayName = 'PerformanceMetrics';
export default PerformanceMetrics;