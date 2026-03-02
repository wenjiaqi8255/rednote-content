import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SessionDetail from '../SessionDetail';
import { StorageProvider } from '@/contexts/StorageContext';
import type { Session } from '@/types/session';

// Mock the useStorageContext
const mockUseStorageContext = {
  currentSession: null,
  updateCurrentSession: jest.fn(),
  saveCurrentSessionImage: jest.fn(),
  deleteSession: jest.fn(),
};

jest.mock('@/contexts/StorageContext', () => ({
  useStorageContext: () => mockUseStorageContext,
  StorageProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock Form and CardPreview components
jest.mock('@/components/Form', () => {
  return function MockForm({ onSubmit, defaultValue }: any) {
    return (
      <div data-testid="mock-form">
        <input
          data-testid="title-input"
          defaultValue={defaultValue?.title || ''}
          onChange={(e) => onSubmit({ ...defaultValue, title: e.target.value })}
        />
        <textarea
          data-testid="markdown-input"
          defaultValue={defaultValue?.markdown || ''}
          onChange={(e) => onSubmit({ ...defaultValue, markdown: e.target.value })}
        />
      </div>
    );
  };
});

jest.mock('@/components/CardPreview', () => {
  return function MockCardPreview({ markdown, theme, mode, sessionId }: any) {
    return (
      <div data-testid="mock-card-preview">
        <div>Markdown: {markdown}</div>
        <div>Theme: {theme}</div>
        <div>Mode: {mode}</div>
        <div>SessionId: {sessionId || 'none'}</div>
      </div>
    );
  };
});

describe('SessionDetail Component - TDD', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // TEST 15: Display current session content
  test('displays current session content', () => {
    const currentSession: Session = {
      id: 'test-123',
      title: 'Test Session',
      markdown: '# Hello World',
      theme: 'default',
      mode: 'separator',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    mockUseStorageContext.currentSession = currentSession as any;

    render(
      <StorageProvider>
        <SessionDetail />
      </StorageProvider>
    );

    expect(screen.getByDisplayValue('Test Session')).toBeInTheDocument();
    expect(screen.getByDisplayValue('# Hello World')).toBeInTheDocument();
  });

  // TEST 16: Update session when form fields change
  test('updates session when form fields change', async () => {
    const currentSession: Session = {
      id: 'test-456',
      title: 'Original',
      markdown: '# Original',
      theme: 'default',
      mode: 'separator',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    mockUseStorageContext.currentSession = currentSession as any;

    render(
      <StorageProvider>
        <SessionDetail />
      </StorageProvider>
    );

    const titleInput = screen.getByTestId('title-input');
    fireEvent.change(titleInput, { target: { value: 'Updated' } });

    await waitFor(() => {
      expect(mockUseStorageContext.updateCurrentSession).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Updated',
        })
      );
    });
  });

  // TEST 17: Display generated image if available
  test('displays generated image if available', () => {
    const currentSession: Session = {
      id: 'test-789',
      title: 'Test',
      markdown: '',
      theme: 'default',
      mode: 'separator',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      imageData: 'data:image/png;base64,fake-image-data',
    };

    mockUseStorageContext.currentSession = currentSession as any;

    render(
      <StorageProvider>
        <SessionDetail />
      </StorageProvider>
    );

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', 'data:image/png;base64,fake-image-data');
  });

  // Additional test: Show empty state when no current session
  test('shows empty state when no current session', () => {
    mockUseStorageContext.currentSession = null as any;

    render(
      <StorageProvider>
        <SessionDetail />
      </StorageProvider>
    );

    expect(screen.getByText(/请选择或创建一个会话/i)).toBeInTheDocument();
  });

  // Additional test: Pass sessionId to CardPreview
  test('passes sessionId to CardPreview when current session exists', () => {
    const currentSession: Session = {
      id: 'session-abc',
      title: 'Test',
      markdown: '# Test',
      theme: 'default',
      mode: 'separator',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    mockUseStorageContext.currentSession = currentSession as any;

    render(
      <StorageProvider>
        <SessionDetail />
      </StorageProvider>
    );

    const preview = screen.getByTestId('mock-card-preview');
    expect(preview).toHaveTextContent('SessionId: session-abc');
  });
});
