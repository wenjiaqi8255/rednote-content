/**
 * Tests for MobileSessionCard component
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { MobileSessionCard } from '../MobileSessionCard';

describe('MobileSessionCard', () => {
  const mockProps = {
    id: 'session-1',
    title: 'Test Session',
    preview: 'This is a preview of the session content...',
    date: '今天 14:32',
    onClick: jest.fn(),
  };

  it('should render session card with all content', () => {
    render(<MobileSessionCard {...mockProps} />);
    expect(screen.getByText('Test Session')).toBeInTheDocument();
    expect(screen.getByText('This is a preview of the session content...')).toBeInTheDocument();
    expect(screen.getByText('今天 14:32')).toBeInTheDocument();
  });

  it('should render "探索期的两个核心任务" title (Pencil design)', () => {
    render(
      <MobileSessionCard
        {...mockProps}
        title="探索期的两个核心任务"
        preview="在职业探索期，最重要的两件事..."
        date="今天 14:32"
        isHighlighted={true}
      />
    );
    expect(screen.getByText('探索期的两个核心任务')).toBeInTheDocument();
    expect(screen.getByText('在职业探索期，最重要的两件事...')).toBeInTheDocument();
  });

  it('should use highlighted background when isHighlighted is true', () => {
    const { container } = render(
      <MobileSessionCard {...mockProps} isHighlighted={true} />
    );
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveStyle({ backgroundColor: '#FFF5F4' });
  });

  it('should use white background when isHighlighted is false', () => {
    const { container } = render(
      <MobileSessionCard {...mockProps} isHighlighted={false} />
    );
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveStyle({ backgroundColor: '#FFFFFF' });
  });

  it('should use red title color when highlighted', () => {
    render(<MobileSessionCard {...mockProps} isHighlighted={true} />);
    const title = screen.getByText('Test Session');
    expect(title).toHaveStyle({ color: '#E42313' });
  });

  it('should use black title color when not highlighted', () => {
    render(<MobileSessionCard {...mockProps} isHighlighted={false} />);
    const title = screen.getByText('Test Session');
    expect(title).toHaveStyle({ color: '#0D0D0D' });
  });

  it('should call onClick with session id when clicked', async () => {
    render(<MobileSessionCard {...mockProps} />);

    const card = screen.getByRole('button');
    await userEvent.click(card);

    expect(mockProps.onClick).toHaveBeenCalledTimes(1);
    expect(mockProps.onClick).toHaveBeenCalledWith('session-1');
  });

  it('should have correct padding (16px 20px)', () => {
    const { container } = render(<MobileSessionCard {...mockProps} />);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveStyle({ padding: '16px 20px' });
  });

  it('should use vertical layout with 6px gap', () => {
    const { container } = render(<MobileSessionCard {...mockProps} />);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveStyle({ flexDirection: 'column' });
    expect(card).toHaveStyle({ gap: '6px' });
  });

  it('should render title with Space Grotesk 15px 500 weight', () => {
    render(<MobileSessionCard {...mockProps} />);
    const title = screen.getByText('Test Session');
    expect(title).toHaveStyle({
      fontFamily: 'Space Grotesk',
      fontSize: '15px',
      fontWeight: '500',
    });
  });

  it('should render preview with Inter 13px and secondary color', () => {
    render(<MobileSessionCard {...mockProps} />);
    const preview = screen.getByText('This is a preview of the session content...');
    expect(preview).toHaveStyle({
      fontFamily: 'Inter',
      fontSize: '13px',
      color: '#7A7A7A',
    });
  });

  it('should render date with Inter 11px and muted color', () => {
    render(<MobileSessionCard {...mockProps} />);
    const date = screen.getByText('今天 14:32');
    expect(date).toHaveStyle({
      fontFamily: 'Inter',
      fontSize: '11px',
      color: '#B0B0B0',
    });
  });

  it('should render bottom divider with correct styles', () => {
    const { container } = render(<MobileSessionCard {...mockProps} />);
    const divider = container.querySelector('div[style*="height: 1px"]') as HTMLElement;
    expect(divider).toHaveStyle({
      height: '1px',
      backgroundColor: '#E8E8E8',
      width: '100%',
    });
  });

  it('should apply custom className', () => {
    const { container } = render(
      <MobileSessionCard {...mockProps} className="custom-class" />
    );
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('custom-class');
  });
});
