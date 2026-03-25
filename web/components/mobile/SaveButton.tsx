/**
 * SaveButton Component
 *
 * Mobile save button for downloading card images.
 * Supports single page save and multi-page ZIP download.
 * Pencil design specification:
 * - Red background (#E42313), 24px border radius
 * - Gap: 8px
 * - Download icon (Lucide download, 18px, white)
 * - "保存图片" text (Space Grotesk, 15px, 600, white)
 * - Width: fill_container
 * - Padding: 14px 0 (vertical), horizontal padding
 */

'use client';

import { Download, FileArchive } from 'lucide-react';
import { useState } from 'react';

export interface SaveButtonProps {
  sessionId: string;
  title: string;
  onGenerateImage: () => Promise<string>;
  onSaveAll?: () => Promise<void>;
  totalPages?: number;
}

export function SaveButton({ sessionId, title, onGenerateImage, onSaveAll, totalPages = 1 }: SaveButtonProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveMode, setSaveMode] = useState<'single' | 'all'>('single');

  const handleSave = async () => {
    if (totalPages > 1 && onSaveAll) {
      // Show both options
      setSaveMode('single');
    }

    setIsSaving(true);
    try {
      if (saveMode === 'all' && onSaveAll) {
        await onSaveAll();
      } else {
        const dataUrl = await onGenerateImage();
        // Create download link
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `${title}-${Date.now()}.png`;
        link.click();
      }
    } catch (error) {
      console.error('Failed to save image:', error);
    } finally {
      setIsSaving(false);
      setSaveMode('single');
    }
  };

  const handleSaveAll = async () => {
    if (!onSaveAll) return;

    setIsSaving(true);
    setSaveMode('all');
    try {
      await onSaveAll();
    } catch (error) {
      console.error('Failed to save all pages:', error);
    } finally {
      setIsSaving(false);
      setSaveMode('single');
    }
  };

  const isMultiPage = totalPages > 1 && onSaveAll;

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleSave}
        disabled={isSaving}
        style={{
          backgroundColor: '#E42313',
          borderRadius: '24px',
          border: 'none',
          cursor: isSaving ? 'not-allowed' : 'pointer',
          padding: '14px 20px',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          opacity: isSaving ? 0.6 : 1,
          transition: 'opacity 0.2s ease',
        }}
      >
        <Download width={18} height={18} color="#FFFFFF" />
        <span
          style={{
            fontFamily: 'Space Grotesk',
            fontSize: '15px',
            fontWeight: '600',
            color: '#FFFFFF',
          }}
        >
          {isSaving ? (saveMode === 'all' ? '打包中...' : '保存中...') : '保存图片'}
        </span>
      </button>

      {isMultiPage && (
        <button
          onClick={handleSaveAll}
          disabled={isSaving}
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            border: '2px solid #E42313',
            cursor: isSaving ? 'not-allowed' : 'pointer',
            padding: '14px 20px',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            opacity: isSaving ? 0.6 : 1,
            transition: 'opacity 0.2s ease',
          }}
        >
          <FileArchive width={18} height={18} color="#E42313" />
          <span
            style={{
              fontFamily: 'Space Grotesk',
              fontSize: '15px',
              fontWeight: '600',
              color: '#E42313',
            }}
          >
            {isSaving ? (saveMode === 'all' ? '打包中...' : '保存中...') : `保存全部 (${totalPages}张)`}
          </span>
        </button>
      )}
    </div>
  );
}
