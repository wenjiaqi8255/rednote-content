import { createSession, saveToStorage, loadFromStorage, deleteSession, updateSession } from '../storage';
import type { Session } from '@/types/session';

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

describe('Storage Functions - TDD', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // TEST 1: Create session with unique ID and timestamps
  describe('createSession', () => {
    test('creates a new session with unique ID and timestamps', () => {
      const sessionData = {
        title: 'Test Session',
        markdown: '# Test',
        theme: 'default',
        mode: 'separator',
      };

      const session = createSession(sessionData);

      expect(session.id).toBeDefined();
      expect(typeof session.id).toBe('string');
      expect(session.createdAt).toBeGreaterThan(0);
      expect(session.updatedAt).toBe(session.createdAt);
      expect(session.title).toBe('Test Session');
      expect(session.markdown).toBe('# Test');
      expect(session.theme).toBe('default');
      expect(session.mode).toBe('separator');
    });

    test('generates unique IDs for different sessions', () => {
      const session1 = createSession({
        title: 'Session 1',
        markdown: '',
        theme: 'default',
        mode: 'separator',
      });

      const session2 = createSession({
        title: 'Session 2',
        markdown: '',
        theme: 'default',
        mode: 'separator',
      });

      expect(session1.id).not.toBe(session2.id);
    });
  });

  // TEST 2: Save to localStorage
  describe('saveToStorage', () => {
    test('saves session data to localStorage', () => {
      const mockSession: Session = {
        id: 'test-123',
        title: 'Test',
        markdown: '# Test',
        theme: 'default',
        mode: 'separator',
        createdAt: 1234567890,
        updatedAt: 1234567890,
      };

      saveToStorage([mockSession], 'test-123');

      const stored = localStorage.getItem('rednote-sessions');
      expect(stored).toBeTruthy();

      const parsed = JSON.parse(stored!);
      expect(parsed.sessions).toHaveLength(1);
      expect(parsed.sessions[0].id).toBe('test-123');
      expect(parsed.currentSessionId).toBe('test-123');
      expect(parsed.lastUpdated).toBeGreaterThan(0);
    });

    test('updates existing data in localStorage', () => {
      const session1 = createSession({
        title: 'Session 1',
        markdown: '',
        theme: 'default',
        mode: 'separator',
      });

      saveToStorage([session1], session1.id);

      const session2 = createSession({
        title: 'Session 2',
        markdown: '',
        theme: 'default',
        mode: 'separator',
      });

      saveToStorage([session1, session2], session2.id);

      const stored = localStorage.getItem('rednote-sessions');
      const parsed = JSON.parse(stored!);

      expect(parsed.sessions).toHaveLength(2);
      expect(parsed.currentSessionId).toBe(session2.id);
    });
  });

  // TEST 3: Load from localStorage
  describe('loadFromStorage', () => {
    test('loads sessions from localStorage', () => {
      const mockSession: Session = {
        id: 'test-123',
        title: 'Test',
        markdown: '# Test',
        theme: 'default',
        mode: 'separator',
        createdAt: 1234567890,
        updatedAt: 1234567890,
      };

      const data = {
        sessions: [mockSession],
        currentSessionId: 'test-123',
        lastUpdated: Date.now(),
      };

      localStorage.setItem('rednote-sessions', JSON.stringify(data));

      const loaded = loadFromStorage();

      expect(loaded.sessions).toHaveLength(1);
      expect(loaded.sessions[0].id).toBe('test-123');
      expect(loaded.currentSessionId).toBe('test-123');
    });

    test('returns empty state when localStorage is empty', () => {
      const loaded = loadFromStorage();

      expect(loaded.sessions).toEqual([]);
      expect(loaded.currentSessionId).toBeNull();
    });

    test('returns empty state for corrupted data', () => {
      localStorage.setItem('rednote-sessions', 'invalid json');

      const loaded = loadFromStorage();

      expect(loaded.sessions).toEqual([]);
      expect(loaded.currentSessionId).toBeNull();
    });
  });

  // TEST 4: Delete session
  describe('deleteSession', () => {
    test('deletes a session by ID', () => {
      const session1 = createSession({
        title: 'Session 1',
        markdown: '',
        theme: 'default',
        mode: 'separator',
      });

      const session2 = createSession({
        title: 'Session 2',
        markdown: '',
        theme: 'default',
        mode: 'separator',
      });

      saveToStorage([session1, session2], session1.id);
      deleteSession(session1.id);

      const loaded = loadFromStorage();

      expect(loaded.sessions).toHaveLength(1);
      expect(loaded.sessions[0].id).toBe(session2.id);
    });

    test('clears current session if deleted session was selected', () => {
      const session = createSession({
        title: 'To Delete',
        markdown: '',
        theme: 'default',
        mode: 'separator',
      });

      saveToStorage([session], session.id);
      deleteSession(session.id);

      const loaded = loadFromStorage();

      expect(loaded.currentSessionId).toBeNull();
    });
  });

  // TEST 5: Update session
  describe('updateSession', () => {
    test('updates session and refreshes timestamp', async () => {
      const session = createSession({
        title: 'Original',
        markdown: '',
        theme: 'default',
        mode: 'separator',
      });

      saveToStorage([session], session.id);

      const originalTime = session.updatedAt;

      // Wait to ensure timestamp difference
      await new Promise((resolve) => setTimeout(resolve, 10));

      updateSession(session.id, { title: 'Updated' });

      const loaded = loadFromStorage();
      const updated = loaded.sessions.find((s) => s.id === session.id);

      expect(updated?.title).toBe('Updated');
      expect(updated?.updatedAt).toBeGreaterThan(originalTime);
      // Other fields remain unchanged
      expect(updated?.markdown).toBe('');
      expect(updated?.theme).toBe('default');
    });

    test('updates multiple fields at once', () => {
      const session = createSession({
        title: 'Original',
        markdown: '# Original',
        theme: 'default',
        mode: 'separator',
      });

      saveToStorage([session], session.id);

      updateSession(session.id, {
        title: 'New Title',
        markdown: '# New Content',
        theme: 'playful-geometric',
      });

      const loaded = loadFromStorage();
      const updated = loaded.sessions.find((s) => s.id === session.id);

      expect(updated?.title).toBe('New Title');
      expect(updated?.markdown).toBe('# New Content');
      expect(updated?.theme).toBe('playful-geometric');
      expect(updated?.mode).toBe('separator'); // unchanged
    });

    test('does nothing if session ID not found', () => {
      const session = createSession({
        title: 'Test',
        markdown: '',
        theme: 'default',
        mode: 'separator',
      });

      saveToStorage([session], session.id);

      const originalData = loadFromStorage();

      updateSession('non-existent-id', { title: 'Should not work' });

      const updatedData = loadFromStorage();

      expect(updatedData).toEqual(originalData);
    });
  });
});
