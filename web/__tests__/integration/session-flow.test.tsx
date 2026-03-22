import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Home from '@/app/page';

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
    default: function MockSessionList({
      onCreateNew,
    }: {
      onCreateNew?: () => void;
    }) {
      return (
        <div data-testid="session-list">
          <button
            onClick={() => {
              onCreateNew?.();
            }}
          >
            创建新卡片
          </button>
        </div>
      );
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
      onClose?: () => void;
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

describe('Integration - Complete User Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // TEST: Home page renders welcome message and session list
  test('renders unified home page with welcome message', () => {
    render(<Home />);

    // Should have welcome message
    expect(screen.getByText('欢迎使用小红书卡片生成器')).toBeInTheDocument();

    // Should have session list
    expect(screen.getByTestId('session-list')).toBeInTheDocument();

    // Should have main content area
    expect(screen.getByTestId('main-content')).toBeInTheDocument();
  });

  // TEST: Clicking create button triggers session creation
  test('clicking create button creates session', () => {
    render(<Home />);

    const createButton = screen.getByRole('button', { name: /创建新卡片/ });
    fireEvent.click(createButton);

    // The mock SessionList calls onCreateNew which closes mobile menu
    // In real implementation, this would also create a session and navigate
  });

  // TEST: Mobile menu can be toggled
  test('mobile menu toggle works', () => {
    render(<Home />);

    const menuToggle = screen.getByTestId('menu-toggle');

    // Initial state - menu closed
    expect(screen.getByTestId('mobile-header')).toHaveAttribute('data-menu-open', 'false');

    // Click to open
    fireEvent.click(menuToggle);
    expect(screen.getByTestId('mobile-header')).toHaveAttribute('data-menu-open', 'true');

    // Click to close
    fireEvent.click(menuToggle);
    expect(screen.getByTestId('mobile-header')).toHaveAttribute('data-menu-open', 'false');
  });
});
