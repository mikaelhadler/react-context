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