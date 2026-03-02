export interface Session {
  id: string;
  title: string;
  markdown: string;
  theme: string;
  mode: string;
  createdAt: number;
  updatedAt: number;
  imageData?: string;
}

export interface StorageData {
  sessions: Session[];
  currentSessionId: string | null;
  lastUpdated: number;
}
