import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-4 text-center">
          <div>
            <h1 className="text-2xl font-bold text-red-500 mb-2">System Malfunction</h1>
            <p className="text-slate-400 mb-4">Terjadi kesalahan sistem. Silakan muat ulang halaman.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-cyan-600 rounded hover:bg-cyan-700 transition-colors"
            >
              Reboot System
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;