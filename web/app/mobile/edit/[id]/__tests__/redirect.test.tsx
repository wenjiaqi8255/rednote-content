/**
 * Mobile Edit Route Redirect Tests (Simplified)
 *
 * TDD Approach: Verify edit redirect renders and triggers redirect
 *
 * React 19 note: React.use() with async params requires Suspense.
 * In tests, we use jest.spyOn to mock React.use to return the resolved value.
 */

import React from 'react';
import { render } from '@testing-library/react';
import MobileEditRedirectPage from '../page';

// Mock Next.js router
const mockReplace = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      replace: mockReplace,
    };
  },
}));

describe('/mobile/edit/[id] route redirect', () => {
  const mockSessionId = 'test-session-123';
  let useSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});

    // Mock React.use to synchronously return the resolved params object
    useSpy = jest.spyOn(React, 'use').mockReturnValue({ id: mockSessionId });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    useSpy.mockRestore();
  });

  it('should render loading spinner', () => {
    const { container } = render(
      <MobileEditRedirectPage params={Promise.resolve({ id: mockSessionId })} />
    );

    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('should render loading text', () => {
    const { container } = render(
      <MobileEditRedirectPage params={Promise.resolve({ id: mockSessionId })} />
    );

    const text = container.querySelector('.text-gray-600');
    expect(text).toHaveTextContent('正在跳转...');
  });

  it('should trigger redirect to unified edit page', () => {
    render(
      <MobileEditRedirectPage params={Promise.resolve({ id: mockSessionId })} />
    );

    // Redirect happens after useEffect with React.use()
    // We verify the router.replace is called with the correct path
    expect(mockReplace).toHaveBeenCalledWith(`/edit/${mockSessionId}`);
  });
});
