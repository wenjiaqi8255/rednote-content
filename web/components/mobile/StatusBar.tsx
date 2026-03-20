/**
 * StatusBar Component
 *
 * Mobile status bar showing time and system icons (signal, wifi, battery).
 * Pencil design specification:
 * - Height: 62px
 * - Padding: [21, 24, 0, 24] (top, right, bottom, left)
 * - Time: Inter, 16px, 600 weight
 * - Icons: Lucide, 16px, gap 6px
 */

import { Signal, Wifi, BatteryFull } from 'lucide-react';

export interface StatusBarProps {
  /** Time to display (default: current time) */
  time?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Formats current time as "H:MM" (e.g., "9:41")
 */
function getCurrentTime(): string {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Mobile status bar component
 */
export function StatusBar({ time, className = '' }: StatusBarProps) {
  const displayTime = time || getCurrentTime();

  return (
    <div
      className={`flex items-center justify-between ${className}`}
      style={{
        height: '62px',
        paddingTop: '21px',
        paddingRight: '24px',
        paddingBottom: '0',
        paddingLeft: '24px',
        color: 'var(--color-text-primary)',
      }}
    >
      {/* Time Label */}
      <span
        style={{
          fontFamily: 'Inter',
          fontSize: '16px',
          fontWeight: '600',
        }}
      >
        {displayTime}
      </span>

      {/* Status Icons */}
      <div className="flex items-center" style={{ gap: '6px' }}>
        <Signal width={16} height={16} />
        <Wifi width={16} height={16} />
        <BatteryFull width={16} height={16} />
      </div>
    </div>
  );
}
