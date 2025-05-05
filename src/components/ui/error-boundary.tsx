import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="rounded-lg bg-destructive/10 p-6 text-destructive">
            <h2 className="text-lg font-semibold">Something went wrong</h2>
            <p className="mt-2">{this.state.error?.message}</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
