export interface Session {
  id: string;
  title: string;
  markdown: string;
  theme: string;
  mode: string;
  createdAt: number;
  updatedAt: number;
  imageData?: string;
  // 卡片样式设置
  outerRingEnabled?: boolean;  // 是否显示外圈，默认 true
  borderRadius?: number;        // 圆角大小 (0-40px)，默认 20
}

export interface StorageData {
  sessions: Session[];
  currentSessionId: string | null;
  lastUpdated: number;
}
