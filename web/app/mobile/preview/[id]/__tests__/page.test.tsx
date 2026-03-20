/**
 * Tests for Mobile Preview Page
 */

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MobilePreviewPage from '../page';
import { StorageProvider } from '@/contexts/StorageContext';

// Mock Next.js router
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: mockPush,
    };
  },
}));

// Mock html2canvas
jest.mock('html2canvas', () => ({
  __esModule: true,
  default: jest.fn(() =>
    Promise.resolve({
      toDataURL: jest.fn(() => 'data:image/png;base64,mock-preview'),
    }),
  ),
}));

// Mock xhs-renderer
jest.mock('@/lib/xhs-renderer', () => ({
  generateXHSCard: jest.fn(() =>
    Promise.resolve('<div>Mock Card HTML</div>')
  ),
}));

// Mock child components
jest.mock('@/components/mobile/StatusBar', () => ({
  StatusBar: ({ time }: { time: string }) => (
    <div data-testid="status-bar" style={{ height: '62px' }}>
      {time}
    </div>
  ),
}));

jest.mock('@/components/mobile/MobileNavBar', () => ({
  MobileNavBar: ({ title, showBack, rightAction, height }: any) => (
    <div
      data-testid="nav-bar"
      style={{
        height: height === 'home' ? '56px' : '48px',
      }}
    >
      <span data-testid="nav-title">{title}</span>
      {showBack && <button data-testid="back-button">Back</button>}
      <div data-testid="right-action">{rightAction}</div>
    </div>
  ),
}));

jest.mock('@/components/mobile/ThemeSelector', () => ({
  ThemeSelector: ({ currentTheme, onThemeChange }: any) => (
    <div data-testid="theme-selector">
      <button onClick={() => onThemeChange('default')}>选择喜欢的排版</button>
      <span data-testid="current-theme">{currentTheme}</span>
    </div>
  ),
}));

jest.mock('@/components/mobile/SaveButton', () => ({
  SaveButton: ({ sessionId, title, onGenerateImage }: any) => (
    <div data-testid="save-button">
      <button onClick={onGenerateImage}>保存图片</button>
      <span data-testid="session-id">{sessionId}</span>
      <span data-testid="title">{title}</span>
    </div>
  ),
}));

describe('Mobile Preview Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with correct dimensions (390px x 844px)', () => {
    const { container } = render(
      <StorageProvider>
        <MobilePreviewPage params={{ id: 'test-session' }} />
      </StorageProvider>
    );

    const main = container.querySelector('main');
    expect(main).toHaveStyle({ width: '390px' });
    expect(main).toHaveStyle({ height: '844px' });
  });

  it('should render status bar with time "02:37"', () => {
    render(
      <StorageProvider>
        <MobilePreviewPage params={{ id: 'test-session' }} />
      </StorageProvider>
    );

    expect(screen.getByTestId('status-bar')).toHaveTextContent('02:37');
  });

  it('should render nav bar with "预览" title', () => {
    render(
      <StorageProvider>
        <MobilePreviewPage params={{ id: 'test-session' }} />
      </StorageProvider>
    );

    expect(screen.getByTestId('nav-title')).toHaveTextContent('预览');
  });

  it('should render nav bar with back button', () => {
    render(
      <StorageProvider>
        <MobilePreviewPage params={{ id: 'test-session' }} />
      </StorageProvider>
    );

    expect(screen.getByTestId('back-button')).toBeInTheDocument();
  });

  it('should render "编辑" link in right action slot', () => {
    render(
      <StorageProvider>
        <MobilePreviewPage params={{ id: 'test-session' }} />
      </StorageProvider>
    );

    expect(screen.getByText('编辑')).toBeInTheDocument();
  });

  it('should render theme selector', () => {
    render(
      <StorageProvider>
        <MobilePreviewPage params={{ id: 'test-session' }} />
      </StorageProvider>
    );

    expect(screen.getByTestId('theme-selector')).toBeInTheDocument();
  });

  it('should render save button', () => {
    render(
      <StorageProvider>
        <MobilePreviewPage params={{ id: 'test-session' }} />
      </StorageProvider>
    );

    expect(screen.getByTestId('save-button')).toBeInTheDocument();
  });

  it('should use flex column layout', () => {
    const { container } = render(
      <StorageProvider>
        <MobilePreviewPage params={{ id: 'test-session' }} />
      </StorageProvider>
    );

    const main = container.querySelector('main');
    expect(main).toHaveStyle({ flexDirection: 'column' });
  });

  it('should have white background', () => {
    const { container } = render(
      <StorageProvider>
        <MobilePreviewPage params={{ id: 'test-session' }} />
      </StorageProvider>
    );

    const main = container.querySelector('main');
    expect(main).toHaveStyle({ backgroundColor: '#FFFFFF' });
  });

  it('should have centered layout with margin auto', () => {
    const { container } = render(
      <StorageProvider>
        <MobilePreviewPage params={{ id: 'test-session' }} />
      </StorageProvider>
    );

    const main = container.querySelector('main');
    expect(main).toHaveStyle({ margin: '0 auto' });
  });

  it('should have scrollable content area', () => {
    const { container } = render(
      <StorageProvider>
        <MobilePreviewPage params={{ id: 'test-session' }} />
      </StorageProvider>
    );

    const contentAreas = container.querySelectorAll('div[style*="flex: 1"]');
    expect(contentAreas.length).toBeGreaterThan(0);
  });
});
