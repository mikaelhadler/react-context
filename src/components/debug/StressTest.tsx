import React, { memo, useState, useCallback } from 'react';
import { Product } from '../../types';
import { generateProducts } from '../../utils/testDataGenerator';
import { StressAction, StressTestConfig, StressTestResult } from '../../interfaces';

interface StressTestProps {
  onStressTest: (action: StressAction, products?: Product[]) => void;
  isRunning: boolean;
  onResults: (results: StressTestResult[]) => void;
}

const availableActions: StressAction[] = [
  { type: 'add', description: 'Add products to cart' },
  { type: 'remove', description: 'Remove products from cart' },
  { type: 'update', description: 'Update product quantities' },
  { type: 'toggle', description: 'Toggle product visibility' },
  { type: 'filter', description: 'Filter products' },
];

const StressTest: React.FC<StressTestProps> = memo(({ onStressTest, isRunning, onResults }) => {
  const [intensity, setIntensity] = useState(1);
  const [duration, setDuration] = useState(5);
  const [selectedActions, setSelectedActions] = useState<Set<string>>(new Set(['add']));

  const toggleAction = (actionType: string) => {
    setSelectedActions(prev => {
      const next = new Set(prev);
      if (next.has(actionType)) {
        next.delete(actionType);
      } else {
        next.add(actionType);
      }
      return next;
    });
  };

  const handleStartStress = useCallback(async () => {
    const results: StressTestResult[] = [];
    const startTime = Date.now();
    const selectedActionsList = availableActions.filter(
      action => selectedActions.has(action.type)
    );

    while (Date.now() - startTime < duration * 1000) {
      for (const action of selectedActionsList) {
        const iterationStart = performance.now();
        
        switch (action.type) {
          case 'add':
            const products = generateProducts(intensity);
            onStressTest(action, products);
            break;
          case 'remove':
            onStressTest(action);
            break;
          case 'update':
            onStressTest(action);
            break;
          case 'toggle':
            onStressTest(action);
            break;
          case 'filter':
            onStressTest(action);
            break;
        }

        const iterationEnd = performance.now();
        results.push({
          action,
          renderTime: iterationEnd - iterationStart,
          memoryUsage: (window.performance as any)?.memory?.usedJSHeapSize || 0,
          timestamp: Date.now()
        });

        await new Promise(resolve => setTimeout(resolve, 1000 / intensity));
      }
    }

    onResults(results);
  }, [intensity, duration, selectedActions, onStressTest, onResults]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Actions to Test
        </label>
        <div className="space-y-2">
          {availableActions.map(action => (
            <label key={action.type} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedActions.has(action.type)}
                onChange={() => toggleAction(action.type)}
                disabled={isRunning}
                className="rounded text-blue-500"
              />
              <span className="text-sm">{action.description}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Intensity (operations/second)
        </label>
        <input
          type="range"
          min="1"
          max="20"
          value={intensity}
          onChange={(e) => setIntensity(Number(e.target.value))}
          disabled={isRunning}
          className="w-full mt-1"
        />
        <span className="text-sm text-gray-500">{intensity} ops/sec</span>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Duration (seconds)
        </label>
        <input
          type="range"
          min="1"
          max="10"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          disabled={isRunning}
          className="w-full mt-1"
        />
        <span className="text-sm text-gray-500">{duration} seconds</span>
      </div>

      <button
        onClick={handleStartStress}
        disabled={isRunning || selectedActions.size === 0}
        className={`w-full px-4 py-2 rounded-lg ${
          isRunning || selectedActions.size === 0
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
      >
        {isRunning ? 'Running...' : 'Start Stress Test'}
      </button>
    </div>
  );
});

export default StressTest;