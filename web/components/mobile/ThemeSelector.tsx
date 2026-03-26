/**
 * ThemeSelector Component
 *
 * Horizontal scrollable theme selector for mobile preview page.
 * Pencil design specification:
 * - Label: "选择喜欢的排版" (Inter, 13px, #7A7A7A)
 * - Horizontal scroll: gap 12px
 * - 8 themes: default, neo-brutalism, terminal, botanical, playful-geometric, retro, professional, sketch
 */

'use client';

import { type Theme } from '@/lib/xhs-renderer';

export interface ThemeSelectorProps {
  currentTheme: string;
  onThemeChange: (theme: Theme) => void;
  themes: Theme[];
}

const THEME_LABELS: Record<Theme, string> = {
  default: '默认',
  'neo-brutalism': '新粗野',
  terminal: '终端',
  botanical: '植物',
  'playful-geometric': '几何',
  retro: '复古',
  professional: '专业',
  sketch: '草图',
};

export function ThemeSelector({ currentTheme, onThemeChange, themes }: ThemeSelectorProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {/* Label */}
      <div
        style={{
          fontFamily: 'Inter',
          fontSize: '13px',
          color: '#7A7A7A',
          fontWeight: '500',
        }}
      >
        选择喜欢的排版
      </div>

      {/* Theme Buttons - Horizontal scroll on desktop */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: '8px',
          maxWidth: '280px',
          overflowX: 'auto',
          // Hide scrollbar but keep functionality
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        } as React.CSSProperties}
      >
        {themes.map((theme) => {
          const isSelected = theme === currentTheme;
          return (
            <button
              key={theme}
              onClick={() => onThemeChange(theme)}
              style={{
                backgroundColor: isSelected ? '#E42313' : '#FFFFFF',
                border: isSelected ? '2px solid #E42313' : '2px solid #E8E8E8',
                borderRadius: '8px',
                padding: '8px 14px',
                fontFamily: 'Inter',
                fontSize: '13px',
                fontWeight: '500',
                color: isSelected ? '#FFFFFF' : '#0D0D0D',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              {THEME_LABELS[theme] || theme}
            </button>
          );
        })}
      </div>
    </div>
  );
}
