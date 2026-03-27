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
  // 卡片样式设置
  outerRingEnabled?: boolean;
  onOuterRingChange?: (enabled: boolean) => void;
  borderRadius?: number;
  onBorderRadiusChange?: (radius: number) => void;
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

export function ThemeSelector({
  currentTheme,
  onThemeChange,
  themes,
  outerRingEnabled = true,
  onOuterRingChange,
  borderRadius = 20,
  onBorderRadiusChange,
}: ThemeSelectorProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Label */}
      <p className="text-sm font-medium text-gray-500">
        选择喜欢的排版
      </p>

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
              className="text-sm font-medium rounded-lg px-3 py-2 cursor-pointer text-left transition-all duration-200 whitespace-nowrap flex-shrink-0"
              style={{
                backgroundColor: isSelected ? '#E42313' : '#FFFFFF',
                border: isSelected ? '2px solid #E42313' : '2px solid #E8E8E8',
                color: isSelected ? '#FFFFFF' : '#0D0D0D',
              }}
            >
              {THEME_LABELS[theme] || theme}
            </button>
          );
        })}
      </div>

      {/* Divider */}
      <div style={{ height: '1px', backgroundColor: '#E8E8E8', margin: '4px 0' }} />

      {/* 卡片样式设置 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* 外圈开关 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="text-sm font-medium text-gray-700">
            显示外圈
          </span>
          <button
            onClick={() => onOuterRingChange?.(!outerRingEnabled)}
            style={{
              width: '44px',
              height: '24px',
              minHeight: '24px', // Override global button min-height: 44px
              borderRadius: '12px',
              backgroundColor: outerRingEnabled ? '#E42313' : '#E8E8E8',
              border: 'none',
              cursor: 'pointer',
              position: 'relative',
              transition: 'background-color 0.2s ease',
              padding: '0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}
          >
            <div
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '10px',
                backgroundColor: '#FFFFFF',
                position: 'relative',
                marginLeft: outerRingEnabled ? '2px' : '2px',
                transition: 'margin-left 0.2s ease',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                flexShrink: 0,
              }}
            />
          </button>
        </div>

        {/* 圆角大小滑块 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="text-sm font-medium text-gray-700">
              圆角大小
            </span>
            <span className="text-sm text-gray-500">
              {borderRadius}px
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="40"
            value={borderRadius}
            onChange={(e) => onBorderRadiusChange?.(Number(e.target.value))}
            style={{
              width: '100%',
              height: '4px',
              borderRadius: '2px',
              backgroundColor: '#E8E8E8',
              appearance: 'none',
              cursor: 'pointer',
            }}
          />
        </div>
      </div>
    </div>
  );
}
