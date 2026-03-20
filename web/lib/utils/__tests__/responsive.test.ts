/**
 * Tests for responsive utility functions
 */

import { isMobile, getDeviceWidth, MOBILE_BREAKPOINT } from '../responsive';

// Mock window object
const mockWindow = (width: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
};

describe('responsive utilities', () => {
  afterEach(() => {
    // Reset to desktop size after each test
    mockWindow(1024);
  });

  describe('MOBILE_BREAKPOINT constant', () => {
    it('should be 768px', () => {
      expect(MOBILE_BREAKPOINT).toBe(768);
    });
  });

  describe('isMobile', () => {
    it('should return true for mobile width (375px)', () => {
      mockWindow(375);
      expect(isMobile()).toBe(true);
    });

    it('should return true for mobile width (390px - Pencil design)', () => {
      mockWindow(390);
      expect(isMobile()).toBe(true);
    });

    it('should return true for tablet width (768px)', () => {
      mockWindow(768);
      expect(isMobile()).toBe(false); // 768 is NOT < 768
    });

    it('should return false for desktop width (1024px)', () => {
      mockWindow(1024);
      expect(isMobile()).toBe(false);
    });

    it('should return false for desktop width (1920px)', () => {
      mockWindow(1920);
      expect(isMobile()).toBe(false);
    });

    it('should handle boundary case (767px)', () => {
      mockWindow(767);
      expect(isMobile()).toBe(true);
    });

    it('should handle boundary case (769px)', () => {
      mockWindow(769);
      expect(isMobile()).toBe(false);
    });
  });

  describe('getDeviceWidth', () => {
    it('should return 390 for mobile screen', () => {
      mockWindow(390);
      expect(getDeviceWidth()).toBe(390);
    });

    it('should return 1024 for desktop screen', () => {
      mockWindow(1024);
      expect(getDeviceWidth()).toBe(1024);
    });

    it('should return current window width', () => {
      const testWidth = 800;
      mockWindow(testWidth);
      expect(getDeviceWidth()).toBe(testWidth);
    });
  });
});
