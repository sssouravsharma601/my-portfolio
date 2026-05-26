import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import ErrorBoundary from './index';

/** Helper component that throws on demand */
function Bomb({ shouldThrow = false }: { shouldThrow?: boolean }) {
  if (shouldThrow) throw new Error('Test explosion 💥');
  return <p>All good</p>;
}

describe('ErrorBoundary', () => {
  // Suppress the expected console.error output during tests
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders children when there is no error', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>,
    );
    expect(getByText('All good')).toBeInTheDocument();
  });

  it('renders the fallback UI when a child throws', () => {
    const { getByRole, getByText } = render(
      <ErrorBoundary>
        <Bomb shouldThrow />
      </ErrorBoundary>,
    );
    expect(getByRole('alert')).toBeInTheDocument();
    expect(getByText(/something went wrong/i)).toBeInTheDocument();
  });

  it('renders a custom fallback when provided', () => {
    const { getByText } = render(
      <ErrorBoundary fallback={(err) => <p>Custom: {err.message}</p>}>
        <Bomb shouldThrow />
      </ErrorBoundary>,
    );
    expect(getByText(/Custom: Test explosion/)).toBeInTheDocument();
  });
});
