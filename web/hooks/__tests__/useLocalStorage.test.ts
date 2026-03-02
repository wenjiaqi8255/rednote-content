import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '../useLocalStorage';
import * as storage from '@/lib/storage';

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

// Mock the storage module
jest.mock('@/lib/storage');

describe('useLocalStorage Hook - TDD', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  // TEST 6: Hook initialization
  test('initializes with empty state when localStorage is empty', () => {
    (storage.loadFromStorage as jest.Mock).mockReturnValue({
      sessions: [],
      currentSessionId: null,
      lastUpdated: Date.now(),
    });

    const { result } = renderHook(() => useLocalStorage());

    expect(result.current.sessions).toEqual([]);
    expect(result.current.currentSession).toBeNull();
  });

  // TEST 7: Create session
  test('creates a new session and sets it as current', () => {
    const mockSession = {
      id: 'test-123',
      title: 'New Session',
      markdown: '# Test',
      theme: 'default',
      mode: 'separator',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    (storage.loadFromStorage as jest.Mock).mockReturnValue({
      sessions: [],
      currentSessionId: null,
      lastUpdated: Date.now(),
    });

    (storage.createSession as jest.Mock).mockReturnValue(mockSession);
    (storage.saveToStorage as jest.Mock).mockImplementation(() => {});

    const { result } = renderHook(() => useLocalStorage());

    act(() => {
      result.current.createSession({
        title: 'New Session',
        markdown: '# Test',
        theme: 'default',
        mode: 'separator',
      });
    });

    expect(storage.createSession).toHaveBeenCalledWith({
      title: 'New Session',
      markdown: '# Test',
      theme: 'default',
      mode: 'separator',
    });

    expect(storage.saveToStorage).toHaveBeenCalled();

    // After creation, should reload and return the new session
    (storage.loadFromStorage as jest.Mock).mockReturnValue({
      sessions: [mockSession],
      currentSessionId: 'test-123',
      lastUpdated: Date.now(),
    });

    // Trigger a re-render to see the updated state
    const { result: newResult } = renderHook(() => useLocalStorage());

    expect(newResult.current.sessions).toHaveLength(1);
    expect(newResult.current.currentSession?.title).toBe('New Session');
  });

  // TEST 8: Delete session
  test('deletes session and clears current if it was selected', () => {
    const mockSession1 = {
      id: 'session-1',
      title: 'To Delete',
      markdown: '',
      theme: 'default',
      mode: 'separator',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const mockSession2 = {
      id: 'session-2',
      title: 'Keep',
      markdown: '',
      theme: 'default',
      mode: 'separator',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    (storage.loadFromStorage as jest.Mock).mockReturnValue({
      sessions: [mockSession1, mockSession2],
      currentSessionId: 'session-1',
      lastUpdated: Date.now(),
    });

    (storage.deleteSession as jest.Mock).mockImplementation(() => {});

    const { result } = renderHook(() => useLocalStorage());

    act(() => {
      result.current.deleteSession('session-1');
    });

    expect(storage.deleteSession).toHaveBeenCalledWith('session-1');

    // After deletion, should reload
    (storage.loadFromStorage as jest.Mock).mockReturnValue({
      sessions: [mockSession2],
      currentSessionId: null,
      lastUpdated: Date.now(),
    });

    const { result: newResult } = renderHook(() => useLocalStorage());

    expect(newResult.current.sessions).toHaveLength(1);
    expect(newResult.current.currentSession).toBeNull();
  });

  // TEST 9: Select session
  test('selects an existing session as current', () => {
    const mockSession1 = {
      id: 'session-1',
      title: 'Session 1',
      markdown: '',
      theme: 'default',
      mode: 'separator',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const mockSession2 = {
      id: 'session-2',
      title: 'Session 2',
      markdown: '',
      theme: 'default',
      mode: 'separator',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    (storage.loadFromStorage as jest.Mock).mockReturnValue({
      sessions: [mockSession1, mockSession2],
      currentSessionId: 'session-1',
      lastUpdated: Date.now(),
    });

    (storage.saveToStorage as jest.Mock).mockImplementation(() => {});

    const { result } = renderHook(() => useLocalStorage());

    expect(result.current.currentSession?.title).toBe('Session 1');

    act(() => {
      result.current.selectSession('session-2');
    });

    expect(storage.saveToStorage).toHaveBeenCalledWith(
      [mockSession1, mockSession2],
      'session-2'
    );

    // After selection
    (storage.loadFromStorage as jest.Mock).mockReturnValue({
      sessions: [mockSession1, mockSession2],
      currentSessionId: 'session-2',
      lastUpdated: Date.now(),
    });

    const { result: newResult } = renderHook(() => useLocalStorage());

    expect(newResult.current.currentSession?.title).toBe('Session 2');
  });

  // TEST 10: Save image data
  test('saves image data to current session', () => {
    const mockSession = {
      id: 'test-123',
      title: 'Test',
      markdown: '',
      theme: 'default',
      mode: 'separator',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      imageData: 'data:image/png;base64,iVBORw0KG...',
    };

    (storage.loadFromStorage as jest.Mock).mockReturnValue({
      sessions: [mockSession],
      currentSessionId: 'test-123',
      lastUpdated: Date.now(),
    });

    (storage.updateSession as jest.Mock).mockImplementation(() => {});

    const { result } = renderHook(() => useLocalStorage());

    act(() => {
      result.current.saveCurrentSessionImage('data:image/png;base64,iVBORw0KG...');
    });

    expect(storage.updateSession).toHaveBeenCalledWith('test-123', {
      imageData: 'data:image/png;base64,iVBORw0KG...',
    });
  });

  // Additional test: Update current session
  test('updates current session data', () => {
    const mockSession = {
      id: 'test-123',
      title: 'Original Title',
      markdown: '# Original',
      theme: 'default',
      mode: 'separator',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    (storage.loadFromStorage as jest.Mock).mockReturnValue({
      sessions: [mockSession],
      currentSessionId: 'test-123',
      lastUpdated: Date.now(),
    });

    (storage.updateSession as jest.Mock).mockImplementation(() => {});

    const { result } = renderHook(() => useLocalStorage());

    act(() => {
      result.current.updateCurrentSession({
        title: 'Updated Title',
        markdown: '# Updated Content',
      });
    });

    expect(storage.updateSession).toHaveBeenCalledWith('test-123', {
      title: 'Updated Title',
      markdown: '# Updated Content',
    });
  });
});
