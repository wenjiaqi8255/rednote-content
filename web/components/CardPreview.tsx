'use client';

/**
 * CardPreview Component
 *
 * Displays a live preview of the card and provides capture/download functionality
 */

import { useRef, useEffect, useState } from 'react';
import html2canvas from 'html2canvas';
import { generateXHSCard, type Theme } from '@/lib/xhs-renderer';

interface CardPreviewProps {
  markdown: string;
  theme: Theme;
  mode: string;
  onCapture?: (dataUrl: string) => void;
}

export default function CardPreview({ markdown, theme, mode, onCapture }: CardPreviewProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [htmlContent, setHtmlContent] = useState('');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  // Generate HTML when markdown or theme changes
  useEffect(() => {
    const generateHtml = async () => {
      const html = await generateXHSCard(markdown, theme);
      setHtmlContent(html);
    };

    generateHtml();
  }, [markdown, theme]);

  // Handle capture with html2canvas
  const handleCapture = async () => {
    if (!cardRef.current) return;

    setIsCapturing(true);

    try {
      // Get the actual dimensions
      const element = cardRef.current;
      const rect = element.getBoundingClientRect();

      // Capture with html2canvas using only valid type options
      const canvas = await html2canvas(element, {
        useCORS: true,
        logging: false,
        background: '#ffffff',
        width: rect.width * 2,
        height: rect.height * 2,
      });

      const dataUrl = canvas.toDataURL('image/png');
      setCapturedImage(dataUrl);

      if (onCapture) {
        onCapture(dataUrl);
      }
    } catch (error) {
      console.error('Capture failed:', error);
      alert('Failed to capture image. Please try again.');
    } finally {
      setIsCapturing(false);
    }
  };

  // Handle download
  const handleDownload = () => {
    if (!capturedImage) {
      alert('Please capture the image first!');
      return;
    }

    const link = document.createElement('a');
    link.href = capturedImage;
    link.download = `card-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="space-y-4">
      {/* Preview Area */}
      <div
        ref={cardRef}
        data-testid="card-preview"
        className="bg-white rounded-lg shadow-md p-8"
        style={{ width: '540px', height: '720px', overflow: 'auto' }}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleCapture}
          disabled={isCapturing}
          className="flex-1 bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isCapturing ? 'Capturing...' : '📸 Capture Image'}
        </button>

        <button
          onClick={handleDownload}
          disabled={!capturedImage}
          className="flex-1 bg-green-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          ⬇️ Download
        </button>
      </div>

      {/* Captured Image Preview */}
      {capturedImage && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Captured Image:</h3>
          <img
            src={capturedImage}
            alt="Captured card"
            className="w-full h-auto rounded-lg shadow-md border-2 border-gray-200"
          />
        </div>
      )}
    </div>
  );
}
