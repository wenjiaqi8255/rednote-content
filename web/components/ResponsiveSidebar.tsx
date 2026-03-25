/**
 * ResponsiveSidebar Component
 *
 * A sidebar that adapts to screen size:
 * - Desktop (≥768px): Always visible, fixed position
 * - Mobile (<768px): Hidden by default, slides in from left when menu is open
 *
 * Similar to Claude's mobile app - click menu button to slide out sidebar.
 */

'use client';

import { ReactNode } from 'react';

interface ResponsiveSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  /** Hide sidebar entirely on desktop (use for focused-mode pages like preview) */
  desktopHidden?: boolean;
}

export function ResponsiveSidebar({ isOpen, onClose, children, desktopHidden }: ResponsiveSidebarProps) {
  const sidebarClass = desktopHidden
    ? 'hidden'
    : `fixed md:flex-1 md:max-w-80 md:min-w-64 inset-y-0 left-0 z-40 w-80 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`;

  const backdropClass = desktopHidden
    ? 'hidden'
    : `fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`;

  return (
    <>
      {/* Mobile backdrop */}
      <div
        data-testid="sidebar-backdrop"
        role="presentation"
        className={backdropClass}
        onClick={onClose}
        aria-hidden={!isOpen}
      />

      {/* Sidebar */}
      <aside
        data-testid="sidebar-content"
        className={sidebarClass}
      >
        {children}
      </aside>
    </>
  );
}
