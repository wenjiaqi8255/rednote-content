import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CardPreview from '../CardPreview';

// Mock html2canvas
jest.mock('html2canvas', () => {
  return () =>
    Promise.resolve({
      toDataURL: () => 'data:image/png;base64,fake-mock-image-data',
    });
});

// Mock xhs-renderer
jest.mock('@/lib/xhs-renderer', () => ({
  generateXHSCard: jest.fn(() => Promise.resolve('<div>Mock HTML</div>')),
  type: {},
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
});

describe('CardPreview Integration with Local Storage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  // Integration Test 1: Capture saves to Local Storage
  test('saves captured image to Local Storage when sessionId provided', async () => {
    const mockSessionId = 'test-session-123';

    // Pre-populate localStorage with session data
    const initialData = {
      sessions: [
        {
          id: mockSessionId,
          title: 'Test Session',
          markdown: '# Test',
          theme: 'default',
          mode: 'separator',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ],
      currentSessionId: mockSessionId,
      lastUpdated: Date.now(),
    };

    localStorage.setItem('rednote-sessions', JSON.stringify(initialData));

    render(
      <CardPreview
        markdown="# Test"
        theme="default"
        mode="separator"
        sessionId={mockSessionId}
      />
    );

    const captureButton = screen.getByText(/Capture Image/i);
    fireEvent.click(captureButton);

    await waitFor(() => {
      const stored = localStorage.getItem('rednote-sessions');
      expect(stored).toBeTruthy();

      const data = JSON.parse(stored!);
      const session = data.sessions.find((s: any) => s.id === mockSessionId);

      expect(session).toBeDefined();
      expect(session.imageData).toBe('data:image/png;base64,fake-mock-image-data');
      expect(session.updatedAt).toBeGreaterThan(initialData.sessions[0].updatedAt);
    });
  });

  // Integration Test 2: Displays saved image on mount
  test('displays previously saved image from Local Storage', () => {
    const mockSessionId = 'test-session-456';
    const savedImageData = 'data:image/png;base64,saved-image-data';

    // Pre-populate localStorage with saved image
    const data = {
      sessions: [
        {
          id: mockSessionId,
          title: 'Test Session',
          markdown: '# Test',
          theme: 'default',
          mode: 'separator',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          imageData: savedImageData,
        },
      ],
      currentSessionId: mockSessionId,
      lastUpdated: Date.now(),
    };

    localStorage.setItem('rednote-sessions', JSON.stringify(data));

    render(
      <CardPreview
        markdown="# Test"
        theme="default"
        mode="separator"
        sessionId={mockSessionId}
      />
    );

    // Should show the saved image immediately
    const savedImage = screen.getByAltText(/Saved card/);
    expect(savedImage).toHaveAttribute('src', savedImageData);
  });

  // Integration Test 3: No sessionId - doesn't save to Local Storage
  test('does not save to Local Storage when sessionId not provided', async () => {
    render(
      <CardPreview markdown="# Test" theme="default" mode="separator" />
    );

    const captureButton = screen.getByText(/Capture Image/i);
    fireEvent.click(captureButton);

    await waitFor(() => {
      const stored = localStorage.getItem('rednote-sessions');
      // Should be null since we never set anything
      expect(stored).toBeNull();
    });
  });

  // Integration Test 4: Image persists across page reloads
  test('image data persists after component unmount and remount', async () => {
    const mockSessionId = 'test-session-789';

    // First render - capture image
    const initialData = {
      sessions: [
        {
          id: mockSessionId,
          title: 'Test Session',
          markdown: '# Test',
          theme: 'default',
          mode: 'separator',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ],
      currentSessionId: mockSessionId,
      lastUpdated: Date.now(),
    };

    localStorage.setItem('rednote-sessions', JSON.stringify(initialData));

    const { unmount: unmount1 } = render(
      <CardPreview
        markdown="# Test"
        theme="default"
        mode="separator"
        sessionId={mockSessionId}
      />
    );

    const captureButton = screen.getByText(/Capture Image/i);
    fireEvent.click(captureButton);

    await waitFor(() => {
      const stored = localStorage.getItem('rednote-sessions');
      const data = JSON.parse(stored!);
      expect(data.sessions[0].imageData).toBe('data:image/png;base64,fake-mock-image-data');
    });

    unmount1();

    // Second render - should show saved image
    render(
      <CardPreview
        markdown="# Test"
        theme="default"
        mode="separator"
        sessionId={mockSessionId}
      />
    );

    const savedImage = screen.getByAltText(/Saved card/);
    expect(savedImage).toBeInTheDocument();
    expect(savedImage).toHaveAttribute('src', 'data:image/png;base64,fake-mock-image-data');
  });
});
