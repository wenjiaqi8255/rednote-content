import type { Session, StorageData } from '@/types/session';

const STORAGE_KEY = 'rednote-sessions';

/**
 * Creates a new session with generated ID and timestamps
 */
export function createSession(
  data: Omit<Session, 'id' | 'createdAt' | 'updatedAt'>
): Session {
  return {
    ...data,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

/**
 * Saves sessions to localStorage
 */
export function saveToStorage(
  sessions: Session[],
  currentSessionId: string | null
): void {
  const data: StorageData = {
    sessions,
    currentSessionId,
    lastUpdated: Date.now(),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/**
 * Loads sessions from localStorage
 * Returns empty state if data is corrupted or missing
 */
export function loadFromStorage(): StorageData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return {
        sessions: [],
        currentSessionId: null,
        lastUpdated: Date.now(),
      };
    }

    const parsed = JSON.parse(stored) as StorageData;

    // Validate basic structure
    if (!parsed.sessions || !Array.isArray(parsed.sessions)) {
      throw new Error('Invalid data structure');
    }

    return parsed;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return {
      sessions: [],
      currentSessionId: null,
      lastUpdated: Date.now(),
    };
  }
}

/**
 * Deletes a session by ID
 * Also clears currentSessionId if the deleted session was selected
 */
export function deleteSession(sessionId: string): void {
  const data = loadFromStorage();

  const filteredSessions = data.sessions.filter((s) => s.id !== sessionId);
  const newCurrentId =
    data.currentSessionId === sessionId ? null : data.currentSessionId;

  saveToStorage(filteredSessions, newCurrentId);
}

/**
 * Updates a session with partial data
 * Automatically refreshes the updatedAt timestamp
 */
export function updateSession(
  sessionId: string,
  updates: Partial<Omit<Session, 'id' | 'createdAt' | 'updatedAt'>>
): void {
  const data = loadFromStorage();

  const sessionIndex = data.sessions.findIndex((s) => s.id === sessionId);

  if (sessionIndex === -1) {
    // Session not found, do nothing
    return;
  }

  const updatedSession: Session = {
    ...data.sessions[sessionIndex],
    ...updates,
    updatedAt: Date.now(),
  };

  data.sessions[sessionIndex] = updatedSession;

  saveToStorage(data.sessions, data.currentSessionId);
}
