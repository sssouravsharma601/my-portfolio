import { Component, type ErrorInfo, type ReactNode } from 'react';
import { profile } from '../../data/profile';
import styles from './ErrorBoundary.module.css';

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
      <div role="alert" className={styles.fallback}>
        <h2 className={styles.title}>Something went wrong</h2>
        <p className={styles.body}>
          An unexpected error occurred. Please refresh the page. If the problem persists, email{' '}
          <a className="link" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
          .
        </p>
        {import.meta.env.DEV && <pre className={styles.stack}>{error.stack}</pre>}
        <button type="button" className={styles.retry} onClick={this.handleReset}>
          Try again
        </button>
      </div>
    );
  }
}
