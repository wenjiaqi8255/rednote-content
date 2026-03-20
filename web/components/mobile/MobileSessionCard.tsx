/**
 * MobileSessionCard Component
 *
 * Mobile session card displaying title, preview text, and date.
 * Pencil design specification:
 * - Layout: Vertical, gap 6px, padding 16px 20px
 * - Title: Space Grotesk, 15px, 500 weight
 * - Preview: Inter, 13px, text-secondary color
 * - Date: Inter, 11px, text-muted color
 * - Conditional background: #FFF5F4 (highlighted) or #FFFFFF (default)
 * - Bottom divider: 1px, #E8E8E8
 */

export interface MobileSessionCardProps {
  /** Session ID */
  id: string;
  /** Session title */
  title: string;
  /** Preview text (truncated) */
  preview: string;
  /** Date string */
  date: string;
  /** Whether to use highlighted background (default: false) */
  isHighlighted?: boolean;
  /** Click handler */
  onClick: (id: string) => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Mobile session card component
 */
export function MobileSessionCard({
  id,
  title,
  preview,
  date,
  isHighlighted = false,
  onClick,
  className = '',
}: MobileSessionCardProps) {
  const backgroundColor = isHighlighted ? '#FFF5F4' : '#FFFFFF';
  const titleColor = isHighlighted ? '#E42313' : '#0D0D0D';

  return (
    <div
      className={`${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        padding: '16px 20px',
        backgroundColor,
        cursor: 'pointer',
      }}
      onClick={() => onClick(id)}
      role="button"
      tabIndex={0}
      aria-label={`Session: ${title}`}
    >
      {/* Title */}
      <div
        style={{
          fontFamily: 'Space Grotesk',
          fontSize: '15px',
          fontWeight: '500',
          color: titleColor,
        }}
      >
        {title}
      </div>

      {/* Preview */}
      <div
        style={{
          fontFamily: 'Inter',
          fontSize: '13px',
          color: '#7A7A7A',
          width: '100%',
        }}
      >
        {preview}
      </div>

      {/* Date */}
      <div
        style={{
          fontFamily: 'Inter',
          fontSize: '11px',
          color: '#B0B0B0',
        }}
      >
        {date}
      </div>

      {/* Bottom Divider */}
      <div
        style={{
          height: '1px',
          backgroundColor: '#E8E8E8',
          width: '100%',
          marginTop: '0',
        }}
      />
    </div>
  );
}
