import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  /** Optional custom fallback UI. Receives the error object. */
  fallback?: (error: Error) => ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Catches synchronous render errors in the subtree and renders a
 * recovery UI instead of crashing the whole page.
 *
 * Usage:
 * ```tsx
 * <ErrorBoundary>
 *   <SomeComponent />
 * </ErrorBoundary>
 * ```
 */
export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // In production you'd forward to Sentry / Datadog here
    console.error('[ErrorBoundary] Uncaught error:', error, info.componentStack);
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (!hasError || !error) return children;

    if (fallback) return fallback(error);

    return (
      <div
        role="alert"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          padding: '2rem',
          textAlign: 'center',
          gap: '1rem',
        }}
      >
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Something went wrong</h2>
        <p style={{ opacity: 0.7, maxWidth: '36rem' }}>
          An unexpected error occurred. Please refresh the page. If the problem persists, contact{' '}
          <a href="mailto:sssouravsharma601@gmail.com">sssouravsharma601@gmail.com</a>.
        </p>
        {import.meta.env.DEV && (
          <pre
            style={{
              background: '#1e1e1e',
              color: '#f8f8f2',
              padding: '1rem',
              borderRadius: '0.5rem',
              fontSize: '0.75rem',
              maxWidth: '100%',
              overflowX: 'auto',
              textAlign: 'left',
            }}
          >
            {error.stack}
          </pre>
        )}
        <button
          onClick={this.handleReset}
          style={{
            padding: '0.6rem 1.4rem',
            background: 'var(--primary)',
            color: '#fff',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Try again
        </button>
      </div>
    );
  }
}
