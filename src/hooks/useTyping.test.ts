import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTyping } from './useTyping';

describe('useTyping', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts with an empty string', () => {
    const { result } = renderHook(() => useTyping(['Frontend Engineer'], 75, 45));
    expect(result.current).toBe('');
  });

  it('types the first character after one tick', () => {
    const { result } = renderHook(() => useTyping(['Hi'], 75, 45));

    act(() => { vi.advanceTimersByTime(75); });
    expect(result.current).toBe('H');
  });

  it('types the second character after two ticks', () => {
    const { result } = renderHook(() => useTyping(['Hi'], 75, 45));

    act(() => { vi.advanceTimersByTime(75); });
    act(() => { vi.advanceTimersByTime(75); });
    expect(result.current).toBe('Hi');
  });

  it('builds up a multi-character phrase tick by tick', () => {
    const phrase = 'ABC';
    const { result } = renderHook(() => useTyping([phrase, 'DEF'], 10, 10));

    // Each character requires one separate act() for React to process the state update
    act(() => { vi.advanceTimersByTime(10); });
    expect(result.current).toBe('A');

    act(() => { vi.advanceTimersByTime(10); });
    expect(result.current).toBe('AB');

    act(() => { vi.advanceTimersByTime(10); });
    expect(result.current).toBe('ABC');
  });
});
