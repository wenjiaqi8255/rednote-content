import { render, screen } from '@testing-library/react';
import Home from '../page';

// Mock Next.js router
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: mockPush,
    };
  },
}));

// Mock useMobileDetection
let mockIsMobile = false;
jest.mock('@/lib/hooks/useMobileDetection', () => ({
  useMobileDetection: () => mockIsMobile,
}));

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
  beforeEach(() => {
    jest.clearAllMocks();
    mockIsMobile = false;
  });

  // TEST 19: Desktop layout
  test('renders desktop layout with sidebar and main content', () => {
    // Mock desktop viewport
    mockIsMobile = false;

    render(<Home />);

    // Should have sidebar container
    expect(screen.getByTestId('sidebar-container')).toBeInTheDocument();

    // Should have main content
    expect(screen.getByTestId('main-content')).toBeInTheDocument();

    // Should NOT have sidebar-backdrop (only for mobile menu)
    expect(screen.queryByTestId('sidebar-backdrop')).not.toBeInTheDocument();

    // Should NOT redirect to /mobile
    expect(mockPush).not.toHaveBeenCalled();
  });

  // TEST 20: Mobile layout with redirect
  test('redirects to /mobile on mobile devices', () => {
    // Mock mobile viewport
    mockIsMobile = true;

    render(<Home />);

    // Should redirect to /mobile route
    expect(mockPush).toHaveBeenCalledWith('/mobile');
  });

  // TEST 21: Desktop does not redirect
  test('does not redirect on desktop devices', () => {
    // Mock desktop viewport
    mockIsMobile = false;

    render(<Home />);

    // Should NOT redirect
    expect(mockPush).not.toHaveBeenCalled();
  });
});
