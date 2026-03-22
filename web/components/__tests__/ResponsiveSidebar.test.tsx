/**
 * ResponsiveSidebar Component Tests
 *
 * TDD Approach: Write failing tests first, then implement.
 *
 * Test Plan:
 * 1. Mobile sidebar is hidden by default
 * 2. Mobile sidebar slides in when isOpen={true}
 * 3. Mobile sidebar slides out when onClose() is called
 * 4. Desktop sidebar is always visible (isOpen state doesn't matter)
 * 5. Backdrop shows on mobile when sidebar is open
 * 6. Backdrop doesn't show on desktop
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { ResponsiveSidebar } from '../ResponsiveSidebar';

describe('ResponsiveSidebar', () => {
  describe('Mobile behavior (< 768px)', () => {
    beforeEach(() => {
      // Mock window.innerWidth to simulate mobile
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 390,
      });

      // Trigger resize event
      window.dispatchEvent(new Event('resize'));
    });

    test('sidebar is hidden by default on mobile', () => {
      const { container } = render(
        <ResponsiveSidebar isOpen={false} onClose={() => {}}>
          <div data-testid="sidebar-content">Sidebar Content</div>
        </ResponsiveSidebar>
      );

      const sidebar = container.querySelector('aside');
      expect(sidebar).toHaveClass('-translate-x-full');
    });

    test('sidebar slides in when isOpen={true} on mobile', () => {
      const { container } = render(
        <ResponsiveSidebar isOpen={true} onClose={() => {}}>
          <div data-testid="sidebar-content">Sidebar Content</div>
        </ResponsiveSidebar>
      );

      const sidebar = container.querySelector('aside');
      expect(sidebar).toHaveClass('translate-x-0');
      expect(sidebar).not.toHaveClass('-translate-x-full');
    });

    test('backdrop shows when sidebar is open on mobile', () => {
      const { container } = render(
        <ResponsiveSidebar isOpen={true} onClose={() => {}}>
          <div data-testid="sidebar-content">Sidebar Content</div>
        </ResponsiveSidebar>
      );

      const backdrop = screen.getByRole('presentation', { hidden: true });
      expect(backdrop).toHaveClass('opacity-100');
      expect(backdrop).not.toHaveClass('pointer-events-none');
    });

    test('backdrop hidden when sidebar is closed on mobile', () => {
      const { container } = render(
        <ResponsiveSidebar isOpen={false} onClose={() => {}}>
          <div data-testid="sidebar-content">Sidebar Content</div>
        </ResponsiveSidebar>
      );

      const backdrop = screen.getByRole('presentation', { hidden: true });
      expect(backdrop).toHaveClass('opacity-0');
      expect(backdrop).toHaveClass('pointer-events-none');
    });

    test('clicking backdrop calls onClose on mobile', () => {
      const handleClose = jest.fn();

      render(
        <ResponsiveSidebar isOpen={true} onClose={handleClose}>
          <div data-testid="sidebar-content">Sidebar Content</div>
        </ResponsiveSidebar>
      );

      const backdrop = screen.getByRole('presentation', { hidden: true });
      fireEvent.click(backdrop);

      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Desktop behavior (≥ 768px)', () => {
    beforeEach(() => {
      // Mock window.innerWidth to simulate desktop
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1280,
      });

      // Trigger resize event
      window.dispatchEvent(new Event('resize'));
    });

    test('sidebar is always visible on desktop (isOpen={false})', () => {
      const { container } = render(
        <ResponsiveSidebar isOpen={false} onClose={() => {}}>
          <div data-testid="sidebar-content">Sidebar Content</div>
        </ResponsiveSidebar>
      );

      const sidebar = container.querySelector('aside');
      // On desktop, sidebar should have md:translate-x-0 (always visible)
      expect(sidebar).toHaveClass('md:translate-x-0');
      expect(sidebar).toHaveClass('-translate-x-full'); // Mobile class also present
    });

    test('sidebar is always visible on desktop (isOpen={true})', () => {
      const { container } = render(
        <ResponsiveSidebar isOpen={true} onClose={() => {}}>
          <div data-testid="sidebar-content">Sidebar Content</div>
        </ResponsiveSidebar>
      );

      const sidebar = container.querySelector('aside');
      // When isOpen=true, component uses unconditional translate-x-0
      expect(sidebar).toHaveClass('translate-x-0');
    });

    test('backdrop never shows on desktop', () => {
      render(
        <ResponsiveSidebar isOpen={true} onClose={() => {}}>
          <div data-testid="sidebar-content">Sidebar Content</div>
        </ResponsiveSidebar>
      );

      // Backdrop should be hidden on desktop
      const backdrop = screen.queryByRole('presentation', { hidden: true });
      expect(backdrop).toBeInTheDocument();
      expect(backdrop).toHaveClass('md:hidden');
    });
  });

  describe('Accessibility', () => {
    test('backdrop has aria-hidden="true" when sidebar is closed', () => {
      render(
        <ResponsiveSidebar isOpen={false} onClose={() => {}}>
          <div data-testid="sidebar-content">Sidebar Content</div>
        </ResponsiveSidebar>
      );

      const backdrop = screen.getByRole('presentation', { hidden: true });
      expect(backdrop).toHaveAttribute('aria-hidden', 'true');
    });

    test('backdrop has aria-hidden="false" when sidebar is open', () => {
      render(
        <ResponsiveSidebar isOpen={true} onClose={() => {}}>
          <div data-testid="sidebar-content">Sidebar Content</div>
        </ResponsiveSidebar>
      );

      const backdrop = screen.getByRole('presentation', { hidden: true });
      expect(backdrop).toHaveAttribute('aria-hidden', 'false');
    });
  });
});
