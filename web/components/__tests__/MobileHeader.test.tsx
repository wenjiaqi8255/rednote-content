import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MobileHeader from '../MobileHeader';

describe('MobileHeader Component - TDD', () => {
  // TEST 18: Toggle menu
  test('toggles menu when hamburger button clicked', () => {
    const toggleMenu = jest.fn();

    render(<MobileHeader isMenuOpen={false} onToggleMenu={toggleMenu} />);

    const menuButton = screen.getByLabelText(/菜单/i);
    fireEvent.click(menuButton);

    expect(toggleMenu).toHaveBeenCalledTimes(1);
  });

  test('renders correct icon based on menu state', () => {
    const { rerender } = render(
      <MobileHeader isMenuOpen={false} onToggleMenu={() => {}} />
    );

    // Menu closed - should show hamburger
    expect(screen.getByLabelText(/打开菜单/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/关闭菜单/i)).not.toBeInTheDocument();

    // Menu open - should show close icon
    rerender(<MobileHeader isMenuOpen={true} onToggleMenu={() => {}} />);
    expect(screen.getByLabelText(/关闭菜单/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/打开菜单/i)).not.toBeInTheDocument();
  });

  test('displays current session title if provided', () => {
    render(
      <MobileHeader
        isMenuOpen={false}
        onToggleMenu={() => {}}
        currentTitle="我的测试卡片"
      />
    );

    expect(screen.getByText('我的测试卡片')).toBeInTheDocument();
  });

  test('does not display title when not provided', () => {
    render(
      <MobileHeader isMenuOpen={false} onToggleMenu={() => {}} />
    );

    expect(screen.queryByText(/我的/i)).not.toBeInTheDocument();
  });
});
