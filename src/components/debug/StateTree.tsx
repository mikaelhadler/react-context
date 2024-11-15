import React, { memo, useState } from 'react';

interface Props {
  data: any;
  name?: string;
  level?: number;
}

const StateTree: React.FC<Props> = memo(({ data, name = 'root', level = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  const renderValue = (value: any, key?: string): React.ReactNode => {
    if (value === null) {
      return (
        <div className="font-mono text-sm" key={key}>
          {key}: null
        </div>
      );
    }
    if (value === undefined) {
      return (
        <div className="font-mono text-sm" key={key}>
          {key}: undefined
        </div>
      );
    }
    if (typeof value === 'object') {
      return (
        <StateTree
          key={key}
          data={value}
          name={key}
          level={level + 1}
        />
      );
    }
    return (
      <div className="font-mono text-sm" key={key}>
        {key}: {String(value)}
      </div>
    );
  };

  if (typeof data !== 'object' || data === null) {
    return (
      <div className="font-mono text-sm">
        {name}: {String(data)}
      </div>
    );
  }

  return (
    <div style={{ marginLeft: level * 20 }}>
      <div
        className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="text-gray-500">
          {isExpanded ? '▼' : '▶'}
        </span>
        <span className="font-mono text-gray-600">{name}</span>
      </div>
      
      {isExpanded && (
        <div className="ml-4">
          {Object.entries(data).map(([key, value]) => renderValue(value, key))}
        </div>
      )}
    </div>
  );
});

StateTree.displayName = 'StateTree';
export default StateTree;