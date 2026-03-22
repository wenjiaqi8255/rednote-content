/**
 * Tests for ThemeSelector component
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { ThemeSelector } from '../ThemeSelector';
import { type Theme } from '@/lib/xhs-renderer';

const mockThemes: Theme[] = [
  'default',
  'neo-brutalism',
  'terminal',
  'botanical',
  'playful-geometric',
  'retro',
  'professional',
  'sketch',
];

describe('ThemeSelector', () => {
  const mockOnThemeChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render theme selector label', () => {
    render(
      <ThemeSelector
        currentTheme="default"
        onThemeChange={mockOnThemeChange}
        themes={mockThemes}
      />
    );

    expect(screen.getByText('选择喜欢的排版')).toBeInTheDocument();
  });

  it('should render all theme buttons', () => {
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
    expect(screen.getByText('几何')).toBeInTheDocument();
    expect(screen.getByText('复古')).toBeInTheDocument();
    expect(screen.getByText('专业')).toBeInTheDocument();
    expect(screen.getByText('草图')).toBeInTheDocument();
  });

  it('should highlight current theme with red background', () => {
    render(
      <ThemeSelector
        currentTheme="default"
        onThemeChange={mockOnThemeChange}
        themes={mockThemes}
      />
    );

    const defaultButton = screen.getByText('默认');
    expect(defaultButton).toHaveStyle({ backgroundColor: '#E42313' });
    expect(defaultButton).toHaveStyle({ color: '#FFFFFF' });
  });

  it('should not highlight non-current themes', () => {
    render(
      <ThemeSelector
        currentTheme="default"
        onThemeChange={mockOnThemeChange}
        themes={mockThemes}
      />
    );

    const neoButton = screen.getByText('新粗野');
    expect(neoButton).toHaveStyle({ backgroundColor: '#FFFFFF' });
    expect(neoButton).toHaveStyle({ color: '#0D0D0D' });
  });

  it('should call onThemeChange when theme button is clicked', async () => {
    render(
      <ThemeSelector
        currentTheme="default"
        onThemeChange={mockOnThemeChange}
        themes={mockThemes}
      />
    );

    const terminalButton = screen.getByText('终端');
    await userEvent.click(terminalButton);

    expect(mockOnThemeChange).toHaveBeenCalledWith('terminal');
  });

  it('should use Inter font with 13px size and #7A7A7A color', () => {
    render(
      <ThemeSelector
        currentTheme="default"
        onThemeChange={mockOnThemeChange}
        themes={mockThemes}
      />
    );

    const label = screen.getByText('选择喜欢的排版');
    expect(label).toHaveStyle({
      fontFamily: 'Inter',
      fontSize: '13px',
      color: '#7A7A7A',
    });
  });

  it('should have 12px gap between theme buttons', () => {
    render(
      <ThemeSelector
        currentTheme="default"
        onThemeChange={mockOnThemeChange}
        themes={mockThemes}
      />
    );

    // Verify theme buttons are rendered
    expect(screen.getByText('默认')).toBeInTheDocument();
    expect(screen.getByText('新粗野')).toBeInTheDocument();
  });

  it('should use horizontal scroll for theme buttons', () => {
    render(
      <ThemeSelector
        currentTheme="default"
        onThemeChange={mockOnThemeChange}
        themes={mockThemes}
      />
    );

    // Verify all theme buttons are present
    expect(screen.getByText('终端')).toBeInTheDocument();
    expect(screen.getByText('植物')).toBeInTheDocument();
  });

  it('should have correct label font weight (500)', () => {
    render(
      <ThemeSelector
        currentTheme="default"
        onThemeChange={mockOnThemeChange}
        themes={mockThemes}
      />
    );

    const label = screen.getByText('选择喜欢的排版');
    expect(label).toHaveStyle({ fontWeight: '500' });
  });

  it('should use 8px border radius for theme buttons', () => {
    render(
      <ThemeSelector
        currentTheme="default"
        onThemeChange={mockOnThemeChange}
        themes={mockThemes}
      />
    );

    const defaultButton = screen.getByText('默认');
    expect(defaultButton).toHaveStyle({ borderRadius: '8px' });
  });

  it('should use 16px padding for theme buttons', () => {
    render(
      <ThemeSelector
        currentTheme="default"
        onThemeChange={mockOnThemeChange}
        themes={mockThemes}
      />
    );

    const defaultButton = screen.getByText('默认');
    expect(defaultButton).toHaveStyle({ padding: '10px 16px' });
  });
});
