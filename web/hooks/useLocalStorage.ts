import { useState, useEffect } from 'react';
import {
  createSession,
  loadFromStorage,
  saveToStorage,
  deleteSession,
  updateSession,
} from '@/lib/storage';
import type { Session } from '@/types/session';

export function useLocalStorage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  // Load data on mount
  useEffect(() => {
    const data = loadFromStorage();
    setSessions(data.sessions);
    setCurrentSessionId(data.currentSessionId);
  }, []);

  // Get the current session object
  const currentSession = sessions.find((s) => s.id === currentSessionId) || null;

  // Create a new session
  const createNewSession = (data: Omit<Session, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newSession = createSession(data);
    const updatedSessions = [...sessions, newSession];

    setSessions(updatedSessions);
    setCurrentSessionId(newSession.id);

    saveToStorage(updatedSessions, newSession.id);

    return newSession.id;
  };

  // Delete a session
  const removeSession = (sessionId: string) => {
    // Call the storage function
    deleteSession(sessionId);

    // Reload data from storage
    const data = loadFromStorage();
    setSessions(data.sessions);
    setCurrentSessionId(data.currentSessionId);
  };

  // Select a session as current
  const selectCurrentSession = (sessionId: string) => {
    setCurrentSessionId(sessionId);
    saveToStorage(sessions, sessionId);
  };

  // Update current session
  const updateCurrent = (
    updates: Partial<Omit<Session, 'id' | 'createdAt' | 'updatedAt'>>
  ) => {
    if (!currentSessionId) return;

    updateSession(currentSessionId, updates);

    // Reload to get updated data
    const data = loadFromStorage();
    setSessions(data.sessions);
  };

  // Save image data to current session
  const saveImage = (imageData: string) => {
    if (!currentSessionId) return;

    updateSession(currentSessionId, { imageData });

    // Reload to get updated data
    const data = loadFromStorage();
    setSessions(data.sessions);
  };

  return {
    sessions,
    currentSession,
    createSession: createNewSession,
    deleteSession: removeSession,
    selectSession: selectCurrentSession,
    updateCurrentSession: updateCurrent,
    saveCurrentSessionImage: saveImage,
  };
}
