/**
 * Responsive utility functions for mobile/desktop detection
 */

export const MOBILE_BREAKPOINT = 768;

/**
 * Check if current viewport is mobile width
 * @returns true if viewport width < 768px
 */
export function isMobile(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  return window.innerWidth < MOBILE_BREAKPOINT;
}

/**
 * Get current device width
 * @returns viewport width in pixels
 */
export function getDeviceWidth(): number {
  if (typeof window === 'undefined') {
    return MOBILE_BREAKPOINT;
  }
  return window.innerWidth;
}
