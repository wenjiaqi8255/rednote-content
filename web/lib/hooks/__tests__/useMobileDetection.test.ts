/**
 * Tests for useMobileDetection Hook
 */

import { renderHook, act } from '@testing-library/react';
import { useMobileDetection } from '../useMobileDetection';

// Mock window object
const mockWindow = (width: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
};

// Mock window.resize event
const triggerResize = (width: number) => {
  mockWindow(width);
  window.dispatchEvent(new Event('resize'));
};

describe('useMobileDetection', () => {
  beforeEach(() => {
    // Reset to desktop size before each test
    mockWindow(1024);
  });

  afterEach(() => {
    // Cleanup
    jest.clearAllMocks();
  });

  it('should return false for desktop width (1024px)', () => {
    mockWindow(1024);
    const { result } = renderHook(() => useMobileDetection());
    expect(result.current).toBe(false);
  });

  it('should return true for mobile width (390px)', () => {
    mockWindow(390);
    const { result } = renderHook(() => useMobileDetection());
    expect(result.current).toBe(true);
  });

  it('should return true for small mobile width (375px)', () => {
    mockWindow(375);
    const { result } = renderHook(() => useMobileDetection());
    expect(result.current).toBe(true);
  });

  it('should update when window resizes from desktop to mobile', () => {
    mockWindow(1024);
    const { result } = renderHook(() => useMobileDetection());

    expect(result.current).toBe(false);

    act(() => {
      triggerResize(390);
    });

    expect(result.current).toBe(true);
  });

  it('should update when window resizes from mobile to desktop', () => {
    mockWindow(390);
    const { result } = renderHook(() => useMobileDetection());

    expect(result.current).toBe(true);

    act(() => {
      triggerResize(1024);
    });

    expect(result.current).toBe(false);
  });

  it('should handle rapid resize events', () => {
    mockWindow(1024);
    const { result } = renderHook(() => useMobileDetection());

    act(() => {
      triggerResize(390);
      triggerResize(414);
      triggerResize(375);
    });

    expect(result.current).toBe(true);
  });

  it('should cleanup resize event listener on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() => useMobileDetection());

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
  });
});
