/**
 * SaveButton Component
 *
 * Mobile save button for downloading card images.
 * Pencil design specification:
 * - Red background (#E42313), 24px border radius
 * - Gap: 8px
 * - Download icon (Lucide download, 18px, white)
 * - "保存图片" text (Space Grotesk, 15px, 600, white)
 * - Width: fill_container
 * - Padding: 14px 0 (vertical), horizontal padding
 */

'use client';

import { Download } from 'lucide-react';
import { useState } from 'react';

export interface SaveButtonProps {
  sessionId: string;
  title: string;
  onGenerateImage: () => Promise<string>;
}

export function SaveButton({ sessionId, title, onGenerateImage }: SaveButtonProps) {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const dataUrl = await onGenerateImage();

      // Create download link
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `${title}-${Date.now()}.png`;
      link.click();
    } catch (error) {
      console.error('Failed to save image:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
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
        {isSaving ? '保存中...' : '保存图片'}
      </span>
    </button>
  );
}
