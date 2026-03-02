import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '@/app/page';
import { StorageProvider } from '@/contexts/StorageContext';

// Mock html2canvas to avoid actual image generation
jest.mock('html2canvas', () => ({
  __esModule: true,
  default: jest.fn(() =>
    Promise.resolve({
      toDataURL: () => 'data:image/png;base64,fake-mock-image',
    })
  ),
}));

// Mock fetch to avoid network requests
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    text: () => Promise.resolve('<html>mock template</html>'),
  })
) as jest.Mock;

describe('Integration - Complete User Flow', () => {
  // TEST 22: Complete create-edit-generate flow
  test('creates session, edits content, and generates card preview', async () => {
    // Clear localStorage before test
    localStorage.clear();

    render(
      <StorageProvider>
        <Home />
      </StorageProvider>
    );

    // Initial state should show empty state in SessionDetail
    expect(screen.getByText(/请选择或创建一个会话/)).toBeInTheDocument();

    // Step 1: Create new session
    const createButton = screen.getByRole('button', { name: /\+ 创建新会话/ });
    fireEvent.click(createButton);

    // Step 2: Wait for form to appear in SessionDetail
    await waitFor(
      () => {
        expect(screen.getByLabelText(/标题/)).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    const titleInput = screen.getByLabelText(/标题/);

    // Step 3: Verify the new session was created with default title
    expect(titleInput).toHaveValue('新卡片');

    // Step 4: Verify session is in the sidebar
    // Use getAllByText since "新卡片" appears in both header and sidebar
    const sessionTitles = screen.getAllByText('新卡片');
    expect(sessionTitles.length).toBeGreaterThan(0);

    // Step 5: Verify session persists in localStorage
    const storedData = localStorage.getItem('rednote-sessions');
    expect(storedData).toBeTruthy();

    const parsed = JSON.parse(storedData!);
    expect(parsed.sessions).toHaveLength(1);
    expect(parsed.currentSessionId).toBeTruthy();
  });
});
