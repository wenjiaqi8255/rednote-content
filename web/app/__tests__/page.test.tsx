import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
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

// Mock the components
jest.mock('@/components/SessionList', () => {
  return {
    __esModule: true,
    default: function MockSessionList() {
      return <div data-testid="session-list">Session List</div>;
    },
  };
});

jest.mock('@/components/ResponsiveSidebar', () => {
  return {
    __esModule: true,
    ResponsiveSidebar: function MockResponsiveSidebar({
      isOpen,
      children,
    }: {
      isOpen: boolean;
      children: React.ReactNode;
    }) {
      return (
        <>
          {/* Backdrop */}
          <div
            data-testid="sidebar-backdrop"
            className={isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
          />
          {/* Sidebar */}
          <aside
            data-testid="sidebar-content"
            className={isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          >
            {children}
          </aside>
        </>
      );
    },
  };
});

jest.mock('@/components/MobileHeader', () => {
  return {
    __esModule: true,
    default: function MockMobileHeader({
      isMenuOpen,
      onToggleMenu,
    }: {
      isMenuOpen: boolean;
      onToggleMenu: () => void;
      currentTitle?: string;
    }) {
      return (
        <div data-testid="mobile-header" data-menu-open={isMenuOpen}>
          <button onClick={onToggleMenu} data-testid="menu-toggle">
            Toggle Menu
          </button>
        </div>
      );
    },
  };
});

// Mock StorageContext
jest.mock('@/contexts/StorageContext', () => ({
  StorageProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useStorageContext: () => ({
    sessions: [],
    currentSession: null,
    createSession: jest.fn(),
    deleteSession: jest.fn(),
    selectSession: jest.fn(),
    updateSession: jest.fn(),
  }),
}));

describe('Home Page - Unified Session List', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // TEST: Renders welcome message
  test('renders welcome message and instructions', () => {
    render(<Home />);

    // Should have welcome message
    expect(screen.getByText('欢迎使用小红书卡片生成器')).toBeInTheDocument();

    // Should have instructions
    expect(screen.getByText('从左侧选择一个会话开始编辑，或创建新卡片')).toBeInTheDocument();

    // Should have session list
    expect(screen.getByTestId('session-list')).toBeInTheDocument();

    // Should have main content area
    expect(screen.getByTestId('main-content')).toBeInTheDocument();
  });

  // TEST: Renders responsive sidebar
  test('renders responsive sidebar with correct initial state', () => {
    render(<Home />);

    // Should have sidebar content
    expect(screen.getByTestId('sidebar-content')).toBeInTheDocument();

    // Should have sidebar backdrop (for mobile)
    expect(screen.getByTestId('sidebar-backdrop')).toBeInTheDocument();
  });

  // TEST: Renders mobile header
  test('renders mobile header', () => {
    render(<Home />);

    // Should have mobile header
    expect(screen.getByTestId('mobile-header')).toBeInTheDocument();

    // Menu should be closed initially
    expect(screen.getByTestId('mobile-header')).toHaveAttribute('data-menu-open', 'false');
  });

  // TEST: Does NOT redirect to /mobile (unified experience)
  test('does not redirect to /mobile route', () => {
    render(<Home />);

    // Should NOT redirect - we now have unified experience
    expect(mockPush).not.toHaveBeenCalled();
  });

  // TEST: Mobile menu toggle works
  test('mobile menu can be toggled', () => {
    render(<Home />);

    const menuToggle = screen.getByTestId('menu-toggle');

    // Initial state - menu closed
    expect(screen.getByTestId('mobile-header')).toHaveAttribute('data-menu-open', 'false');

    // Click to open
    fireEvent.click(menuToggle);
    expect(screen.getByTestId('mobile-header')).toHaveAttribute('data-menu-open', 'true');
  });
});
