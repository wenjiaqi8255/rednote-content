/**
 * Tests for Mobile Editor Page
 */

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MobileEditorPage from '../page';
import { StorageProvider } from '@/contexts/StorageContext';

// Mock Next.js router
const mockPush = jest.fn();
const mockBack = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: mockPush,
      back: mockBack,
    };
  },
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
  MobileNavBar: ({ title, showBack, rightAction, height, onBack }: any) => (
    <div
      data-testid="nav-bar"
      style={{
        height: height === 'home' ? '56px' : '48px',
      }}
    >
      <span data-testid="nav-title">{title}</span>
      {showBack && <button data-testid="back-button" onClick={onBack}>Back</button>}
      <div data-testid="right-action">{rightAction}</div>
    </div>
  ),
}));

jest.mock('@/components/mobile/MarkdownInput', () => ({
  MarkdownInput: ({ sessionId }: { sessionId: string }) => (
    <div data-testid="markdown-input" data-session-id={sessionId}>
      <input data-testid="title-input" placeholder="输入标题" />
      <textarea data-testid="body-input" placeholder="粘贴到这里或输入文字，内容将自动保存" />
    </div>
  ),
}));

describe('Mobile Editor Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with correct dimensions (390px x 844px)', () => {
    const { container } = render(<MobileEditorPage params={{ id: 'test-session' }} />);
    const main = container.querySelector('main');
    expect(main).toHaveStyle({ width: '390px' });
    expect(main).toHaveStyle({ height: '844px' });
  });

  it('should render status bar with time "02:36"', () => {
    render(<StorageProvider><MobileEditorPage params={{ id: 'test-session' }} /></StorageProvider>);
    const statusBar = screen.getByTestId('status-bar');
    expect(statusBar).toHaveTextContent('02:36');
  });

  it('should render nav bar with "写长文" title', () => {
    render(<StorageProvider><MobileEditorPage params={{ id: 'test-session' }} /></StorageProvider>);
    const navTitle = screen.getByTestId('nav-title');
    expect(navTitle).toHaveTextContent('写长文');
  });

  it('should render nav bar with back button', () => {
    render(<StorageProvider><MobileEditorPage params={{ id: 'test-session' }} /></StorageProvider>);
    const backButton = screen.getByTestId('back-button');
    expect(backButton).toBeInTheDocument();
  });

  it('should render nav bar with inner height (48px)', () => {
    const { container } = render(<MobileEditorPage params={{ id: 'test-session' }} />);
    const navBar = screen.getByTestId('nav-bar');
    expect(navBar).toHaveStyle({ height: '48px' });
  });

  it('should render FormatButton in right action slot', () => {
    render(<StorageProvider><MobileEditorPage params={{ id: 'test-session' }} /></StorageProvider>);
    const rightAction = screen.getByTestId('right-action');
    expect(rightAction).toBeInTheDocument();
    // FormatButton should be in the right action slot
    expect(rightAction).toContainHTML('一键排版');
  });

  it('should render divider after nav bar', () => {
    const { container } = render(<MobileEditorPage params={{ id: 'test-session' }} />);
    const divider = container.querySelector('div[style*="height: 1px"]');
    expect(divider).toHaveStyle({ backgroundColor: '#E8E8E8' });
  });

  it('should render MarkdownInput component with sessionId', () => {
    render(<StorageProvider><MobileEditorPage params={{ id: 'test-session' }} /></StorageProvider>);
    const markdownInput = screen.getByTestId('markdown-input');
    expect(markdownInput).toBeInTheDocument();
    expect(markdownInput).toHaveAttribute('data-session-id', 'test-session');
  });

  it('should render title input', () => {
    render(<StorageProvider><MobileEditorPage params={{ id: 'test-session' }} /></StorageProvider>);
    const titleInput = screen.getByPlaceholderText('输入标题');
    expect(titleInput).toBeInTheDocument();
  });

  it('should render body input', () => {
    render(<StorageProvider><MobileEditorPage params={{ id: 'test-session' }} /></StorageProvider>);
    const bodyInput = screen.getByPlaceholderText('粘贴到这里或输入文字，内容将自动保存');
    expect(bodyInput).toBeInTheDocument();
  });

  it('should use flex column layout', () => {
    const { container } = render(<MobileEditorPage params={{ id: 'test-session' }} />);
    const main = container.querySelector('main');
    expect(main).toHaveStyle({ flexDirection: 'column' });
  });

  it('should have white background', () => {
    const { container } = render(<MobileEditorPage params={{ id: 'test-session' }} />);
    const main = container.querySelector('main');
    expect(main).toHaveStyle({ backgroundColor: '#FFFFFF' });
  });

  it('should have centered layout with margin auto', () => {
    const { container } = render(<MobileEditorPage params={{ id: 'test-session' }} />);
    const main = container.querySelector('main');
    expect(main).toHaveStyle({ margin: '0 auto' });
  });

  it('should have overflow hidden on main container', () => {
    const { container } = render(<MobileEditorPage params={{ id: 'test-session' }} />);
    const main = container.querySelector('main');
    expect(main).toHaveStyle({ overflow: 'hidden' });
  });

  it('should have scrollable content area', () => {
    render(<StorageProvider><MobileEditorPage params={{ id: 'test-session' }} /></StorageProvider>);
    const markdownInput = screen.getByTestId('markdown-input');
    expect(markdownInput).toBeInTheDocument();
  });
});
