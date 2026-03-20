/**
 * Tests for MobileNavBar component
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { MobileNavBar } from '../MobileNavBar';

describe('MobileNavBar', () => {
  it('should render title in center', () => {
    render(<MobileNavBar title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('should render "Rednote Post" title (Pencil home design)', () => {
    render(<MobileNavBar title="Rednote Post" height="home" />);
    expect(screen.getByText('Rednote Post')).toBeInTheDocument();
  });

  it('should render "写长文" title (Pencil editor design)', () => {
    render(<MobileNavBar title="写长文" height="inner" />);
    expect(screen.getByText('写长文')).toBeInTheDocument();
  });

  it('should render "预览" title (Pencil preview design)', () => {
    render(<MobileNavBar title="预览" height="inner" />);
    expect(screen.getByText('预览')).toBeInTheDocument();
  });

  it('should not show back button by default', () => {
    const { container } = render(<MobileNavBar title="Test" />);
    const backButtons = container.querySelectorAll('button');
    expect(backButtons).toHaveLength(0);
  });

  it('should show back button when showBack is true', () => {
    const { container } = render(<MobileNavBar title="Test" showBack={true} />);
    const backButtons = container.querySelectorAll('button');
    expect(backButtons).toHaveLength(1);
  });

  it('should call onBack when back button is clicked', async () => {
    const onBack = jest.fn();
    const { container } = render(
      <MobileNavBar title="Test" showBack={true} onBack={onBack} />
    );

    const backButton = container.querySelector('button');
    if (backButton) {
      await userEvent.click(backButton);
      expect(onBack).toHaveBeenCalledTimes(1);
    }
  });

  it('should have correct height for home variant (56px)', () => {
    const { container } = render(<MobileNavBar title="Test" height="home" />);
    const navBar = container.firstChild as HTMLElement;
    expect(navBar).toHaveStyle({ height: '56px' });
  });

  it('should have correct height for inner variant (48px)', () => {
    const { container } = render(<MobileNavBar title="Test" height="inner" />);
    const navBar = container.firstChild as HTMLElement;
    expect(navBar).toHaveStyle({ height: '48px' });
  });

  it('should have correct font size for home variant (20px)', () => {
    render(<MobileNavBar title="Test" height="home" />);
    const title = screen.getByText('Test');
    expect(title).toHaveStyle({ fontSize: '20px' });
  });

  it('should have correct font size for inner variant (17px)', () => {
    render(<MobileNavBar title="Test" height="inner" />);
    const title = screen.getByText('Test');
    expect(title).toHaveStyle({ fontSize: '17px' });
  });

  it('should use Space Grotesk font with 600 weight', () => {
    render(<MobileNavBar title="Test" />);
    const title = screen.getByText('Test');
    expect(title).toHaveStyle({
      fontFamily: 'Space Grotesk',
      fontWeight: '600',
    });
  });

  it('should render right action when provided', () => {
    const rightAction = <button>Right Button</button>;
    render(<MobileNavBar title="Test" rightAction={rightAction} />);
    expect(screen.getByText('Right Button')).toBeInTheDocument();
  });

  it('should have correct padding (16px left and right)', () => {
    const { container } = render(<MobileNavBar title="Test" />);
    const navBar = container.firstChild as HTMLElement;
    expect(navBar).toHaveStyle({
      paddingLeft: '16px',
      paddingRight: '16px',
    });
  });

  it('should use flexbox layout with space-between', () => {
    const { container } = render(<MobileNavBar title="Test" />);
    const navBar = container.firstChild as HTMLElement;
    expect(navBar).toHaveClass('justify-between');
  });
});
