/**
 * MobileNavBar Component
 *
 * Mobile navigation bar with back button, title, and right action slot.
 * Pencil design specification:
 * - Home height: 56px (with title and right action)
 * - Inner height: 48px (with back button)
 * - Title: Space Grotesk, 17-20px, 600 weight
 * - Left: Back button (conditional, Lucide chevron-left, 24px)
 * - Right: Action button slot
 */

import { ChevronLeft } from 'lucide-react';

export interface MobileNavBarProps {
  /** Title text to display in center */
  title: string;
  /** Show back button on left (default: false) */
  showBack?: boolean;
  /** Action button/component to display on right */
  rightAction?: React.ReactNode;
  /** Height variant: 'home' (56px) or 'inner' (48px) */
  height?: 'home' | 'inner';
  /** Back button click handler */
  onBack?: () => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Mobile navigation bar component
 */
export function MobileNavBar({
  title,
  showBack = false,
  rightAction,
  height = 'inner',
  onBack,
  className = '',
}: MobileNavBarProps) {
  const heightValue = height === 'home' ? '56px' : '48px';
  const fontSize = height === 'home' ? '20px' : '17px';

  return (
    <div
      className={`flex items-center justify-between ${className}`}
      style={{
        height: heightValue,
        paddingRight: '16px',
        paddingLeft: '16px',
        color: 'var(--color-text-primary)',
      }}
    >
      {/* Left: Back Button (conditional) */}
      {showBack && (
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            padding: '0',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
          }}
          aria-label="Go back"
        >
          <ChevronLeft width={24} height={24} />
        </button>
      )}

      {/* Center: Title */}
      <span
        style={{
          fontFamily: 'Space Grotesk',
          fontSize,
          fontWeight: '600',
          flex: 1,
          textAlign: 'center',
        }}
      >
        {title}
      </span>

      {/* Right: Action Button */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {rightAction}
      </div>
    </div>
  );
}
