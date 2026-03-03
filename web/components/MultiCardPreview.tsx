'use client';

/**
 * MultiCardPreview Component
 *
 * Displays multiple card previews based on markdown content split by --- separator.
 * Provides "Capture All" and "Download All" functionality.
 */

import { useState, useRef } from 'react';
import { splitMarkdownBySeparator, type Theme } from '@/lib/xhs-renderer';
import html2canvas from 'html2canvas';
import JSZip from 'jszip';

interface MultiCardPreviewProps {
  markdown: string;
  theme: Theme;
  sessionId?: string;
}

interface CapturedCard {
  index: number;
  dataUrl: string;
  content: string;
}

export default function MultiCardPreview({ markdown, theme, sessionId }: MultiCardPreviewProps) {
  const cardContents = splitMarkdownBySeparator(markdown);
  const [capturedCards, setCapturedCards] = useState<Map<number, CapturedCard>>(new Map());
  const [isCapturingAll, setIsCapturingAll] = useState(false);
  const [captureProgress, setCaptureProgress] = useState({ current: 0, total: 0 });
  const [htmlContents, setHtmlContents] = useState<string[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Generate HTML for all cards on mount
  useState(() => {
    const generateAllHtml = async () => {
      const { generateXHSCard } = await import('@/lib/xhs-renderer');
      const htmls = await Promise.all(
        cardContents.map(content => generateXHSCard(content, theme))
      );
      setHtmlContents(htmls);
    };
    generateAllHtml();
  });

  // Individual card capture
  const handleCaptureCard = async (index: number) => {
    const cardElement = cardRefs.current[index];
    if (!cardElement) return;

    try {
      const rect = cardElement.getBoundingClientRect();
      const canvas = await html2canvas(cardElement, {
        useCORS: true,
        logging: false,
        background: '#ffffff',
        width: rect.width * 2,
        height: rect.height * 2,
      });

      const dataUrl = canvas.toDataURL('image/png');
      const newCard: CapturedCard = {
        index,
        dataUrl,
        content: cardContents[index],
      };

      setCapturedCards(prev => new Map(prev).set(index, newCard));
      return dataUrl;
    } catch (error) {
      console.error(`Failed to capture card ${index + 1}:`, error);
      alert(`Failed to capture card ${index + 1}. Please try again.`);
      return null;
    }
  };

  // Batch capture all cards
  const handleCaptureAll = async () => {
    if (cardContents.length === 0) return;

    setIsCapturingAll(true);
    setCaptureProgress({ current: 0, total: cardContents.length });

    try {
      for (let i = 0; i < cardContents.length; i++) {
        await handleCaptureCard(i);
        setCaptureProgress({ current: i + 1, total: cardContents.length });
      }
    } finally {
      setIsCapturingAll(false);
      setCaptureProgress({ current: 0, total: 0 });
    }
  };

  // Download all images as ZIP
  const handleDownloadAll = async () => {
    if (capturedCards.size === 0) {
      alert('Please capture cards first!');
      return;
    }

    try {
      const zip = new JSZip();

      // Add each captured image to the ZIP
      capturedCards.forEach((card, index) => {
        const base64Data = card.dataUrl.split(',')[1];
        zip.file(`card_${index + 1}.png`, base64Data, { base64: true });
      });

      // Generate ZIP file
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);

      // Trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = `xhs-cards-${Date.now()}.zip`;
      link.click();

      // Cleanup
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to create ZIP:', error);
      alert('Failed to create ZIP file. Please try again.');
    }
  };

  if (cardContents.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No content to display. Please add some markdown content.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Card Count Indicator */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm font-medium text-blue-900">
          📊 Detected <strong>{cardContents.length}</strong> card{cardContents.length > 1 ? 's' : ''} separated by ---
        </p>
      </div>

      {/* Progress Indicator */}
      {isCapturingAll && (
        <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              Capturing cards...
            </span>
            <span className="text-sm text-gray-600">
              {captureProgress.current} / {captureProgress.total}
            </span>
          </div>
          <div className="mt-2 w-full bg-gray-300 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${(captureProgress.current / captureProgress.total) * 100}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Individual Card Previews */}
      <div className="space-y-8">
        {cardContents.map((content, index) => (
          <div key={index} className="space-y-3">
            {/* Card Header */}
            <div className="flex items-center justify-between">
              <h4 className="text-md font-semibold text-gray-800">
                Card {index + 1} / {cardContents.length}
              </h4>
              {capturedCards.has(index) && (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  ✓ Captured
                </span>
              )}
            </div>

            {/* Card Preview */}
            <div
              ref={(el) => {
                if (el) cardRefs.current[index] = el;
              }}
              className="bg-white rounded-lg shadow-md p-8"
              style={{
                width: '540px',
                height: '720px',
                overflow: 'auto',
              }}
              dangerouslySetInnerHTML={{ __html: htmlContents[index] || '' }}
            />

            {/* Individual Card Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => handleCaptureCard(index)}
                disabled={isCapturingAll}
                className="flex-1 bg-gray-900 text-white font-semibold py-2 px-4 rounded-md hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm transition-colors"
              >
                📸 Capture Card {index + 1}
              </button>

              {capturedCards.has(index) && (
                <button
                  onClick={() => {
                    const card = capturedCards.get(index);
                    if (card) {
                      const link = document.createElement('a');
                      link.href = card.dataUrl;
                      link.download = `card_${index + 1}.png`;
                      link.click();
                    }
                  }}
                  className="flex-1 bg-gray-700 text-white font-semibold py-2 px-4 rounded-md hover:bg-gray-600 text-sm transition-colors"
                >
                  ⬇️ Download
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Batch Actions */}
      <div className="border-t border-gray-200 pt-6 space-y-3">
        <button
          onClick={handleCaptureAll}
          disabled={isCapturingAll || cardContents.length === 0}
          className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-lg transition-colors"
        >
          {isCapturingAll
            ? `Capturing... (${captureProgress.current}/${captureProgress.total})`
            : `📸 Capture All Cards (${capturedCards.size}/${cardContents.length})`}
        </button>

        <button
          onClick={handleDownloadAll}
          disabled={capturedCards.size === 0}
          className="w-full bg-gray-700 text-white font-semibold py-3 px-6 rounded-md hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-lg transition-colors"
        >
          ⬇️ Download All ({capturedCards.size} images) as ZIP
        </button>
      </div>

      {/* Captured Cards Preview */}
      {capturedCards.size > 0 && (
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold mb-4">Captured Cards Preview</h3>
          <div className="grid grid-cols-2 gap-4">
            {Array.from(capturedCards.values())
              .sort((a, b) => a.index - b.index)
              .map((card) => (
                <div key={card.index} className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">
                    Card {card.index + 1}
                  </p>
                  <img
                    src={card.dataUrl}
                    alt={`Card ${card.index + 1}`}
                    className="w-full h-auto rounded-lg shadow-md border-2 border-gray-200"
                  />
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
