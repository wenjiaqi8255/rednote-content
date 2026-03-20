/**
 * Tests for MarkdownInput component
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { MarkdownInput } from '../MarkdownInput';

// Mock StorageContext
const mockUpdateCurrentSession = jest.fn();

jest.mock('@/contexts/StorageContext', () => ({
  useStorageContext: () => ({
    sessions: [],
    currentSession: {
      id: 'test-session',
      title: 'Test Title',
      markdown: 'Test Body',
      theme: 'default',
      mode: 'edit',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    createSession: jest.fn(),
    deleteSession: jest.fn(),
    selectSession: jest.fn(),
    updateCurrentSession: mockUpdateCurrentSession,
    saveCurrentSessionImage: jest.fn(),
  }),
}));

describe('MarkdownInput', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render title and body inputs', () => {
    render(<MarkdownInput sessionId="test-session" />);

    expect(screen.getByPlaceholderText('输入标题')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('粘贴到这里或输入文字，内容将自动保存')
    ).toBeInTheDocument();
  });

  it('should use initialTitle and initialBody props', () => {
    render(
      <MarkdownInput
        sessionId="different-session"
        initialTitle="Custom Title"
        initialBody="Custom Body"
      />
    );

    const titleInput = screen.getByPlaceholderText('输入标题') as HTMLInputElement;
    const bodyInput = screen.getByPlaceholderText(
      '粘贴到这里或输入文字，内容将自动保存'
    ) as HTMLTextAreaElement;

    expect(titleInput.value).toBe('Custom Title');
    expect(bodyInput.value).toBe('Custom Body');
  });

  it('should use currentSession data when IDs match', () => {
    render(<MarkdownInput sessionId="test-session" />);

    const titleInput = screen.getByPlaceholderText('输入标题') as HTMLInputElement;
    expect(titleInput.value).toBe('Test Title');
  });

  it('should update title state on input change', async () => {
    render(<MarkdownInput sessionId="test-session" />);

    const titleInput = screen.getByPlaceholderText('输入标题');

    // Clear first then type
    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, 'New Title');

    expect((titleInput as HTMLInputElement).value).toBe('New Title');
  });

  it('should update body state on input change', async () => {
    render(<MarkdownInput sessionId="test-session" />);

    const bodyInput = screen.getByPlaceholderText(
      '粘贴到这里或输入文字，内容将自动保存'
    );
    await userEvent.type(bodyInput, 'New body content');

    expect(
      (bodyInput as HTMLTextAreaElement).value
    ).toContain('New body content');
  });

  it('should have correct padding (20px)', () => {
    const { container } = render(<MarkdownInput sessionId="test" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveStyle({ padding: '20px' });
  });

  it('should use vertical layout with 16px gap', () => {
    const { container } = render(<MarkdownInput sessionId="test" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveStyle({ flexDirection: 'column' });
    expect(wrapper).toHaveStyle({ gap: '16px' });
  });

  it('should have title input with Space Grotesk 22px 600 weight', () => {
    const { container } = render(<MarkdownInput sessionId="test" />);
    const titleInput = screen.getByPlaceholderText('输入标题');
    expect(titleInput).toHaveStyle({
      fontFamily: 'Space Grotesk',
      fontSize: '22px',
      fontWeight: '600',
    });
  });

  it('should have body input with Inter 15px and 1.6 lineHeight', () => {
    const { container } = render(<MarkdownInput sessionId="test" />);
    const bodyInput = screen.getByPlaceholderText(
      '粘贴到这里或输入文字，内容将自动保存'
    );
    expect(bodyInput).toHaveStyle({
      fontFamily: 'Inter',
      fontSize: '15px',
      lineHeight: '1.6',
    });
  });

  it('should call updateCurrentSession after 500ms debounce', async () => {
    render(<MarkdownInput sessionId="test-session" />);

    const titleInput = screen.getByPlaceholderText('输入标题');

    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, 'Updated Title');

    // Wait for debounce
    await new Promise(resolve => setTimeout(resolve, 600));

    // Check that it was called with the updated title
    const calls = mockUpdateCurrentSession.mock.calls;
    const lastCall = calls[calls.length - 1];
    expect(lastCall[0]).toMatchObject({
      title: 'Updated Title',
    });
  }, 10000);

  it('should not call updateCurrentSession immediately (except for initial load)', () => {
    render(<MarkdownInput sessionId="test-session" />);

    // Should be called once on mount with initial data
    expect(mockUpdateCurrentSession).toHaveBeenCalledTimes(1);
    // But not called again immediately after mount without changes
    expect(mockUpdateCurrentSession).toHaveBeenCalledWith({
      title: 'Test Title',
      markdown: 'Test Body',
    });
  });
});
