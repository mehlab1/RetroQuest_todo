import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
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
        <div className="min-h-screen bg-gameboy-dark flex items-center justify-center p-4">
          <div className="bg-gameboy-medium border-4 border-gameboy-border rounded-lg p-8 max-w-md text-center">
            <div className="w-16 h-16 mx-auto mb-4 text-4xl">💥</div>
            <h1 className="font-pixel text-lg text-gameboy-lightest mb-4">
              Oops! Something went wrong
            </h1>
            <p className="font-pixel text-sm text-gameboy-light mb-6">
              The app encountered an unexpected error. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gameboy-light text-gameboy-dark font-pixel text-sm py-2 px-6 border-2 border-gameboy-lightest rounded hover:bg-gameboy-lightest transition-colors"
            >
              Refresh Page
            </button>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 text-left">
                <summary className="font-pixel text-xs text-gameboy-light cursor-pointer">
                  Error Details (Development)
                </summary>
                <pre className="font-pixel text-xs text-gameboy-light mt-2 p-2 bg-gameboy-dark rounded overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
