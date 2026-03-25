/**
 * MarkdownInput Component
 *
 * Markdown input fields for title and body with auto-save.
 * Pencil design specification:
 * - Layout: Vertical, gap 16px, padding 20px
 * - Title input: Space Grotesk, 22px, 600 weight, placeholder color #D0D0D0D
 * - Body input: Inter, 15px, normal weight, lineHeight 1.6, placeholder color #D0D0D0D
 * - Auto-save: 500ms debounce to prevent frequent writes
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useStorageContext } from '@/contexts/StorageContext';

// Custom styles for placeholder color
const inputStyles = {
  title: {
    fontFamily: 'Space Grotesk',
    fontSize: '22px',
    fontWeight: 600,
    color: '#0D0D0D',
    border: 'none',
    outline: 'none',
    background: 'transparent',
    width: '100%',
  } as React.CSSProperties,
  body: {
    fontFamily: 'Inter',
    fontSize: '15px',
    fontWeight: 'normal',
    lineHeight: '1.6',
    color: '#0D0D0D',
    border: 'none',
    outline: 'none',
    background: 'transparent',
    width: '100%',
    flex: 1,
    minHeight: '60vh', // Tall textarea so users can see/edit full content
    resize: 'none' as const,
  },
};

export interface MarkdownInputProps {
  sessionId: string;
  initialTitle?: string;
  initialBody?: string;
}

/**
 * Debounce hook to delay updates
 */
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Markdown input component with auto-save
 */
export function MarkdownInput({
  sessionId,
  initialTitle = '',
  initialBody = '',
}: MarkdownInputProps) {
  const { currentSession, updateCurrentSession, isLoading } = useStorageContext();
  const isCurrentSession = currentSession?.id === sessionId;

  console.log('[MarkdownInput] Rendering:', {
    sessionId,
    isCurrentSession,
    isLoading,
    currentSessionId: currentSession?.id || 'null',
  });

  // Wait for loading before initializing state
  const [title, setTitle] = useState(() => {
    if (isLoading) {
      console.log('[MarkdownInput] Loading, returning empty title');
      return ''; // Will be set by sync effect
    }
    console.log('[MarkdownInput] Initializing title, isCurrentSession:', isCurrentSession);
    if (isCurrentSession && currentSession) {
      return currentSession.title;
    }
    return initialTitle;
  });

  const [body, setBody] = useState(() => {
    if (isLoading) {
      return ''; // Will be set by sync effect
    }
    if (isCurrentSession && currentSession) {
      return currentSession.markdown;
    }
    return initialBody;
  });

  // Track whether we've synced from currentSession (to prevent overwriting user input)
  const hasSyncedRef = useRef(false);

  // Debounce values to prevent excessive updates
  const debouncedTitle = useDebounce(title, 500);
  const debouncedBody = useDebounce(body, 500);

  // Auto-save effect
  useEffect(() => {
    if (isCurrentSession && (debouncedTitle || debouncedBody)) {
      updateCurrentSession({
        title: debouncedTitle,
        markdown: debouncedBody,
      });
    }
  }, [debouncedTitle, debouncedBody, isCurrentSession, updateCurrentSession]);

  // Sync with currentSession when it becomes available (but only once per session)
  useEffect(() => {
    console.log('[MarkdownInput] Sync effect:', {
      isCurrentSession,
      hasSyncedRef: hasSyncedRef.current,
      currentSessionTitle: currentSession?.title || 'null',
    });
    if (isCurrentSession && currentSession && !hasSyncedRef.current) {
      setTitle(currentSession.title);
      setBody(currentSession.markdown);
      hasSyncedRef.current = true;
    }
  }, [currentSession, isCurrentSession]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        padding: '20px',
        height: '100%',
        minHeight: 0, // Allow flex child to shrink below content size
      }}
    >
      {/* Title Input */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="输入标题"
        style={inputStyles.title}
      />

      {/* Body Input */}
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="粘贴到这里或输入文字，内容将自动保存"
        style={inputStyles.body}
      />
    </div>
  );
}
