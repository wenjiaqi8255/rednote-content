'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage as useLocalStorageHook } from '@/hooks/useLocalStorage';
import type { Session } from '@/types/session';

interface StorageContextType {
  sessions: Session[];
  currentSession: Session | null;
  createSession: (data: Omit<Session, 'id' | 'createdAt' | 'updatedAt'>) => string;
  deleteSession: (sessionId: string) => void;
  selectSession: (sessionId: string) => void;
  updateCurrentSession: (
    updates: Partial<Omit<Session, 'id' | 'createdAt' | 'updatedAt'>>
  ) => void;
  saveCurrentSessionImage: (imageData: string) => void;
}

const StorageContext = createContext<StorageContextType | null>(null);

export function StorageProvider({ children }: { children: ReactNode }) {
  const storage = useLocalStorageHook();

  return (
    <StorageContext.Provider value={storage}>
      {children}
    </StorageContext.Provider>
  );
}

export function useStorageContext() {
  const context = useContext(StorageContext);
  if (!context) {
    throw new Error('useStorageContext must be used within StorageProvider');
  }
  return context;
}
