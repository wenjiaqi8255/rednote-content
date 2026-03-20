/**
 * Tests for StatusBar component
 */

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { StatusBar } from '../StatusBar';

describe('StatusBar', () => {
  beforeEach(() => {
    // Mock current time to ensure consistent tests
    jest.spyOn(Date.prototype, 'getHours').mockReturnValue(9);
    jest.spyOn(Date.prototype, 'getMinutes').mockReturnValue(41);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render status bar with default current time', () => {
    render(<StatusBar />);
    expect(screen.getByText('9:41')).toBeInTheDocument();
  });

  it('should render status bar with custom time', () => {
    render(<StatusBar time="14:30" />);
    expect(screen.getByText('14:30')).toBeInTheDocument();
  });

  it('should render status bar with "02:36" time (Pencil design example)', () => {
    render(<StatusBar time="02:36" />);
    expect(screen.getByText('02:36')).toBeInTheDocument();
  });

  it('should render all three status icons', () => {
    const { container } = render(<StatusBar />);
    const icons = container.querySelectorAll('svg');
    expect(icons).toHaveLength(3);
  });

  it('should have correct height (62px)', () => {
    const { container } = render(<StatusBar />);
    const statusBar = container.firstChild as HTMLElement;
    expect(statusBar).toHaveStyle({ height: '62px' });
  });

  it('should have correct padding (21px top, 24px right, 0px bottom, 24px left)', () => {
    const { container } = render(<StatusBar />);
    const statusBar = container.firstChild as HTMLElement;
    expect(statusBar).toHaveStyle({
      paddingTop: '21px',
      paddingRight: '24px',
      paddingBottom: '0px',
      paddingLeft: '24px',
    });
  });

  it('should apply custom className', () => {
    const { container } = render(<StatusBar className="custom-class" />);
    const statusBar = container.firstChild as HTMLElement;
    expect(statusBar).toHaveClass('custom-class');
  });

  it('should use flexbox layout with space-between', () => {
    const { container } = render(<StatusBar />);
    const statusBar = container.firstChild as HTMLElement;
    expect(statusBar).toHaveClass('justify-between');
  });

  it('should display time in Inter font with 16px size and 600 weight', () => {
    const { container } = render(<StatusBar time="9:41" />);
    const timeLabel = screen.getByText('9:41');
    expect(timeLabel).toHaveStyle({
      fontFamily: 'Inter',
      fontSize: '16px',
      fontWeight: '600',
    });
  });

  it('should have 6px gap between status icons', () => {
    const { container } = render(<StatusBar />);
    // Find the second flex items-center container (status icons)
    const iconsContainer = container.querySelectorAll('.flex.items-center')[1] as HTMLElement;
    expect(iconsContainer).toHaveStyle({ gap: '6px' });
  });
});
