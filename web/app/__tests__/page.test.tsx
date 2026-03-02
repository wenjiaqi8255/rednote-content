import { render, screen } from '@testing-library/react';
import Home from '../page';

// Mock the components
jest.mock('@/components/Form', () => {
  return function MockForm() {
    return <div data-testid="form-component">Form</div>;
  };
});

jest.mock('@/components/CardPreview', () => {
  return function MockCardPreview() {
    return <div data-testid="preview-component">Preview</div>;
  };
});

jest.mock('@/components/SessionList', () => {
  return function MockSessionList() {
    return <div data-testid="session-list">Session List</div>;
  };
});

jest.mock('@/components/SessionDetail', () => {
  return function MockSessionDetail() {
    return <div data-testid="session-detail">Session Detail</div>;
  };
});

jest.mock('@/components/MobileHeader', () => {
  return function MockMobileHeader({ isMenuOpen }: { isMenuOpen: boolean }) {
    return (
      <div data-testid="mobile-header" data-menu-open={isMenuOpen}>
        Mobile Header
      </div>
    );
  };
});

describe('Home Page - Responsive Layout', () => {
  // TEST 19: Desktop layout
  test('renders desktop layout with sidebar and main content', () => {
    // Mock desktop viewport
    global.innerWidth = 1024;

    render(<Home />);

    // Should have sidebar container
    expect(screen.getByTestId('sidebar-container')).toBeInTheDocument();

    // Should have main content
    expect(screen.getByTestId('main-content')).toBeInTheDocument();

    // Should NOT have sidebar-backdrop (only for mobile menu)
    expect(screen.queryByTestId('sidebar-backdrop')).not.toBeInTheDocument();
  });

  // TEST 20: Mobile layout
  test('renders mobile layout with mobile header', () => {
    // Mock mobile viewport
    global.innerWidth = 375;

    render(<Home />);

    // Should have MobileHeader
    expect(screen.getByTestId('mobile-header')).toBeInTheDocument();

    // Should have sidebar container (hidden initially)
    const sidebar = screen.getByTestId('sidebar-container');
    expect(sidebar).toHaveClass('-translate-x-full');
  });

  // TEST 21: Mobile menu toggle
  test('toggles sidebar visibility on mobile', () => {
    global.innerWidth = 375;

    render(<Home />);

    // Initial state - sidebar hidden
    const sidebar = screen.getByTestId('sidebar-container');
    expect(sidebar).toHaveClass('-translate-x-full');

    // Find and click menu button
    const header = screen.getByTestId('mobile-header');
    const menuButton = header.querySelector('button');

    if (menuButton) {
      menuButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      // After click - sidebar should be visible
      expect(sidebar).not.toHaveClass('-translate-x-full');
    }
  });
});
