import { colors, spacing, typography, borderRadius } from '../design-system';

describe('Design System - TDD', () => {
  // TEST 23: Color tokens
  describe('colors', () => {
    test('exports valid color tokens', () => {
      expect(colors).toBeDefined();
      expect(colors.primary).toBeDefined();
      expect(colors.primary[500]).toMatch(/^#[0-9a-f]{6}$/i);
      expect(colors.accent).toBeDefined();
      expect(colors.accent[500]).toMatch(/^#[0-9a-f]{6}$/i);
      expect(colors.neutral).toBeDefined();
      expect(colors.success).toBeDefined();
      expect(colors.warning).toBeDefined();
      expect(colors.error).toBeDefined();
    });

    test('has consistent color scale', () => {
      // Check that primary color has all expected shades
      expect(colors.primary[100]).toBeDefined();
      expect(colors.primary[200]).toBeDefined();
      expect(colors.primary[300]).toBeDefined();
      expect(colors.primary[400]).toBeDefined();
      expect(colors.primary[500]).toBeDefined();
      expect(colors.primary[600]).toBeDefined();
      expect(colors.primary[700]).toBeDefined();
      expect(colors.primary[800]).toBeDefined();
      expect(colors.primary[900]).toBeDefined();
    });

    test('has functional color variants', () => {
      // Check for functional colors
      expect(colors.success).toHaveProperty('500');
      expect(colors.warning).toHaveProperty('500');
      expect(colors.error).toHaveProperty('500');
    });
  });

  // TEST 24: Spacing tokens
  describe('spacing', () => {
    test('exports consistent spacing tokens', () => {
      expect(spacing).toBeDefined();
      expect(spacing.xs).toBeDefined();
      expect(spacing.sm).toBeDefined();
      expect(spacing.md).toBeDefined();
      expect(spacing.lg).toBeDefined();
      expect(spacing.xl).toBeDefined();
      expect(spacing['2xl']).toBeDefined();
    });

    test('spacing values are numbers', () => {
      expect(typeof spacing.xs).toBe('number');
      expect(typeof spacing.sm).toBe('number');
      expect(typeof spacing.md).toBe('number');
      expect(typeof spacing.lg).toBe('number');
      expect(typeof spacing.xl).toBe('number');
    });

    test('spacing scale is consistent', () => {
      // Each level should be larger than the previous
      expect(spacing.sm).toBeGreaterThan(spacing.xs);
      expect(spacing.md).toBeGreaterThan(spacing.sm);
      expect(spacing.lg).toBeGreaterThan(spacing.md);
      expect(spacing.xl).toBeGreaterThan(spacing.lg);
    });
  });

  // Additional tests: Typography
  describe('typography', () => {
    test('exports typography tokens', () => {
      expect(typography).toBeDefined();
      expect(typography.fontSize).toBeDefined();
      expect(typography.fontWeight).toBeDefined();
      expect(typography.lineHeight).toBeDefined();
    });

    test('has standard font sizes', () => {
      expect(typography.fontSize.xs).toBeDefined();
      expect(typography.fontSize.sm).toBeDefined();
      expect(typography.fontSize.base).toBeDefined();
      expect(typography.fontSize.lg).toBeDefined();
      expect(typography.fontSize.xl).toBeDefined();
      expect(typography.fontSize['2xl']).toBeDefined();
      expect(typography.fontSize['3xl']).toBeDefined();
    });

    test('has font weights', () => {
      expect(typography.fontWeight.normal).toBeDefined();
      expect(typography.fontWeight.medium).toBeDefined();
      expect(typography.fontWeight.semibold).toBeDefined();
      expect(typography.fontWeight.bold).toBeDefined();
    });
  });

  // Additional tests: Border Radius
  describe('borderRadius', () => {
    test('exports border radius tokens', () => {
      expect(borderRadius).toBeDefined();
      expect(borderRadius.sm).toBeDefined();
      expect(borderRadius.md).toBeDefined();
      expect(borderRadius.lg).toBeDefined();
      expect(borderRadius.xl).toBeDefined();
      expect(borderRadius.full).toBeDefined();
    });

    test('border radius values are strings', () => {
      expect(typeof borderRadius.sm).toBe('string');
      expect(typeof borderRadius.md).toBe('string');
      expect(typeof borderRadius.lg).toBe('string');
    });
  });
});
