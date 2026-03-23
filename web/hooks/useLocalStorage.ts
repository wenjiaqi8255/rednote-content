import { useState, useEffect, useCallback } from 'react';
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
  const [isLoading, setIsLoading] = useState(true);

  // Load data on mount
  useEffect(() => {
    console.log('[useLocalStorage] Mounting, loading from storage...');
    const data = loadFromStorage();
    console.log('[useLocalStorage] Loaded data:', {
      sessionsCount: data.sessions.length,
      currentSessionId: data.currentSessionId,
    });
    setSessions(data.sessions);
    setCurrentSessionId(data.currentSessionId);
    setIsLoading(false);
    console.log('[useLocalStorage] isLoading set to false');
  }, []);

  // Get the current session object
  const currentSession = sessions.find((s) => s.id === currentSessionId) || null;
  console.log('[useLocalStorage] currentSession:', currentSession?.id || 'null');

  // Create a new session
  const createNewSession = useCallback((data: Omit<Session, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newSession = createSession(data);

    // Use functional update to avoid depending on sessions in dependency array
    setSessions((prevSessions) => {
      const updatedSessions = [...prevSessions, newSession];
      saveToStorage(updatedSessions, newSession.id);
      return updatedSessions;
    });

    setCurrentSessionId(newSession.id);

    return newSession.id;
  }, []);

  // Delete a session
  const removeSession = useCallback((sessionId: string) => {
    // Call the storage function
    deleteSession(sessionId);

    // Reload data from storage
    const data = loadFromStorage();
    setSessions(data.sessions);
    setCurrentSessionId(data.currentSessionId);
  }, []);

  // Select a session as current (with validation)
  const selectCurrentSession = useCallback((sessionId: string) => {
    // Validate session exists before selecting
    setSessions((prevSessions) => {
      const sessionExists = prevSessions.some(s => s.id === sessionId);
      if (!sessionExists) {
        console.warn('[useLocalStorage] Attempted to select non-existent session:', sessionId);
        return prevSessions; // Don't change anything
      }
      console.log('[useLocalStorage] Selecting session:', sessionId);
      setCurrentSessionId(sessionId);
      saveToStorage(prevSessions, sessionId);
      return prevSessions;
    });
  }, []);

  // Update current session
  const updateCurrent = useCallback((
    updates: Partial<Omit<Session, 'id' | 'createdAt' | 'updatedAt'>>
  ) => {
    if (!currentSessionId) return;

    updateSession(currentSessionId, updates);

    // Reload to get updated data
    const data = loadFromStorage();
    setSessions(data.sessions);
  }, [currentSessionId]);

  // Save image data to current session
  const saveImage = useCallback((imageData: string) => {
    if (!currentSessionId) return;

    updateSession(currentSessionId, { imageData });

    // Reload to get updated data
    const data = loadFromStorage();
    setSessions(data.sessions);
  }, [currentSessionId]);

  return {
    sessions,
    currentSession,
    isLoading,
    createSession: createNewSession,
    deleteSession: removeSession,
    selectSession: selectCurrentSession,
    updateCurrentSession: updateCurrent,
    saveCurrentSessionImage: saveImage,
  };
}
