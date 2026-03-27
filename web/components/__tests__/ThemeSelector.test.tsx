/**
 * ThemeSelector Component Tests
 *
 * TDD Approach: Write failing tests first, then implement.
 *
 * Test Plan:
 * 1. Renders label "选择喜欢的排版"
 * 2. Displays all theme buttons
 * 3. Vertical scrolling container with max-height
 * 4. Selected theme highlighted with red background
 * 5. Clicking theme calls onThemeChange
 * 6. Scrollbar hidden but functional
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeSelector } from '../mobile/ThemeSelector';
import { type Theme } from '@/lib/xhs-renderer';

describe('ThemeSelector', () => {
  const mockThemes: Theme[] = [
    'default',
    'neo-brutalism',
    'terminal',
    'botanical',
  ];

  const mockOnThemeChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    test('renders label text', () => {
      render(
        <ThemeSelector
          currentTheme="default"
          onThemeChange={mockOnThemeChange}
          themes={mockThemes}
        />
      );

      expect(screen.getByText('选择喜欢的排版')).toBeInTheDocument();
    });

    test('renders all theme buttons', () => {
      render(
        <ThemeSelector
          currentTheme="default"
          onThemeChange={mockOnThemeChange}
          themes={mockThemes}
        />
      );

      expect(screen.getByText('默认')).toBeInTheDocument();
      expect(screen.getByText('新粗野')).toBeInTheDocument();
      expect(screen.getByText('终端')).toBeInTheDocument();
      expect(screen.getByText('植物')).toBeInTheDocument();
    });
  });

  describe('Vertical Scrolling Container', () => {
    test('has maxHeight limiting container height', () => {
      const { container } = render(
        <ThemeSelector
          currentTheme="default"
          onThemeChange={mockOnThemeChange}
          themes={mockThemes}
        />
      );

      // Find the scrollable container by checking for max-height in style
      const scrollContainer = container.querySelector('div[style*="max-height"]');
      expect(scrollContainer).toBeInTheDocument();
      expect(scrollContainer?.getAttribute('style')).toContain('max-height: 240px');
    });

    test('has overflowY auto for vertical scrolling', () => {
      const { container } = render(
        <ThemeSelector
          currentTheme="default"
          onThemeChange={mockOnThemeChange}
          themes={mockThemes}
        />
      );

      const scrollContainer = container.querySelector('div[style*="overflow-y"]');
      expect(scrollContainer).toBeInTheDocument();
      expect(scrollContainer?.getAttribute('style')).toContain('overflow-y: auto');
    });
  });

  describe('Selection State', () => {
    test('highlights selected theme with red background', () => {
      const { container } = render(
        <ThemeSelector
          currentTheme="neo-brutalism"
          onThemeChange={mockOnThemeChange}
          themes={mockThemes}
        />
      );

      // Find the selected theme button
      const selectedButton = Array.from(container.querySelectorAll('button')).find(
        (btn) => btn.textContent === '新粗野'
      );

      expect(selectedButton).toHaveStyle({ backgroundColor: '#E42313' });
      expect(selectedButton).toHaveStyle({ color: '#FFFFFF' });
    });

    test('non-selected themes have white background', () => {
      const { container } = render(
        <ThemeSelector
          currentTheme="default"
          onThemeChange={mockOnThemeChange}
          themes={mockThemes}
        />
      );

      const nonSelectedButton = Array.from(container.querySelectorAll('button')).find(
        (btn) => btn.textContent === '新粗野'
      );

      expect(nonSelectedButton).toHaveStyle({ backgroundColor: '#FFFFFF' });
      expect(nonSelectedButton).toHaveStyle({ color: '#0D0D0D' });
    });
  });

  describe('Interaction', () => {
    test('clicking theme button calls onThemeChange', () => {
      const { container } = render(
        <ThemeSelector
          currentTheme="default"
          onThemeChange={mockOnThemeChange}
          themes={mockThemes}
        />
      );

      const terminalButton = Array.from(container.querySelectorAll('button')).find(
        (btn) => btn.textContent === '终端'
      );

      fireEvent.click(terminalButton!);

      expect(mockOnThemeChange).toHaveBeenCalledTimes(1);
      expect(mockOnThemeChange).toHaveBeenCalledWith('terminal');
    });
  });

  describe('Scrollbar Styling', () => {
    test('hides scrollbar while keeping scroll functionality', () => {
      const { container } = render(
        <ThemeSelector
          currentTheme="default"
          onThemeChange={mockOnThemeChange}
          themes={mockThemes}
        />
      );

      const scrollContainer = container.querySelector('div[style*="scrollbar"]');

      // Check scrollbar hiding style (webkits)
      expect(scrollContainer?.getAttribute('style')).toContain('scrollbar-width: none');
    });
  });
});
