/**
 * Mobile Route Redirect Tests
 *
 * The /mobile route now redirects to the unified home page.
 * These tests verify the redirect behavior.
 */

import React from 'react';
import { render } from '@testing-library/react';
import MobileRedirectPage from '../page';

// Mock Next.js router
const mockReplace = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      replace: mockReplace,
    };
  },
}));

describe('/mobile route redirect', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render loading spinner', () => {
    const { container } = render(<MobileRedirectPage />);

    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('should render loading text', () => {
    const { container } = render(<MobileRedirectPage />);

    const text = container.querySelector('.text-gray-600');
    expect(text).toHaveTextContent('正在跳转...');
  });

  it('should trigger redirect to unified home page', () => {
    render(<MobileRedirectPage />);

    // Redirect happens after useEffect
    expect(mockReplace).toHaveBeenCalledWith('/');
  });
});
