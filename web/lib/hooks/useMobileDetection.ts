/**
 * React Hook for mobile device detection
 *
 * Uses window.innerWidth to detect screen width and updates on resize.
 * Returns true for mobile screens (< 768px width).
 */

import { useState, useEffect } from 'react';

export function useMobileDetection(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Initial detection
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Check on mount
    checkMobile();

    // Update on resize
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}
