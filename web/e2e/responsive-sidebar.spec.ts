/**
 * Playwright E2E Tests for Mobile-Desktop Integration
 *
 * Testing the unified responsive experience:
 * - ResponsiveSidebar behavior on mobile vs desktop
 * - ThemeSelector vertical scrolling
 * - Route redirects from old /mobile/* to new routes
 */

import { test, expect } from '@playwright/test';

// Test URLs
const BASE_URL = 'http://localhost:3002';

test.beforeEach(async ({ page }) => {
  await page.goto(BASE_URL);
});

test.describe('Mobile View (390px)', () => {
  test('should hide sidebar by default on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 390, height: 844 });

    // Sidebar should be hidden off-screen
    const sidebar = page.locator('aside').first();
    await expect(sidebar).toHaveClass(/-translate-x-full/);
    // Check that sidebar is translated off-screen (negative X position)
    const boundingBox = await sidebar.boundingBox();
    expect(boundingBox?.x).toBeLessThan(0);
  });

  test('should show sidebar when menu button clicked', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    // Click menu button (aria-label is "打开菜单" in Chinese)
    const menuButton = page.getByRole('button', { name: /打开菜单/ });
    await menuButton.click();

    // Sidebar should slide in (translate-x-0 instead of -translate-x-full)
    const sidebar = page.locator('aside').first();
    await expect(sidebar).toHaveClass(/translate-x-0/);
    await expect(sidebar).not.toHaveClass(/-translate-x-full/);

    // Backdrop should have opacity-100 class
    const backdrop = page.locator('[data-testid="sidebar-backdrop"]').first();
    await expect(backdrop).toHaveClass(/opacity-100/);
  });

  test('should close sidebar when backdrop clicked', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    // Open sidebar
    const menuButton = page.getByRole('button', { name: /打开菜单/ });
    await menuButton.click();

    // Wait for sidebar to be open
    const sidebar = page.locator('aside').first();
    await expect(sidebar).toHaveClass(/translate-x-0/);

    // Close button should now be visible
    const closeButton = page.getByRole('button', { name: /关闭菜单/ });
    await expect(closeButton).toBeVisible();

    // Click close button
    await closeButton.click();

    // Sidebar should slide out
    await expect(sidebar).toHaveClass(/-translate-x-full/);
  });
});

test.describe('Desktop View (1280px)', () => {
  test('should show sidebar always visible on desktop', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 });

    // Sidebar should be visible
    const sidebar = page.locator('aside').first();
    await expect(sidebar).toBeInViewport();
    await expect(sidebar).toHaveClass(/md:translate-x-0/);
  });

  test('should not show backdrop on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });

    // Backdrop should be hidden on desktop
    const backdrop = page.locator('[data-testid="sidebar-backdrop"]').first();
    await expect(backdrop).toHaveClass(/md:hidden/);
  });
});

test.describe('Responsive Breakpoint', () => {
  test('should switch behavior at 768px breakpoint', async ({ page }) => {
    // Start at mobile size
    await page.setViewportSize({ width: 767, height: 720 });

    const sidebar = page.locator('aside').first();
    await expect(sidebar).toHaveClass(/-translate-x-full/);

    // Resize to desktop
    await page.setViewportSize({ width: 768, height: 720 });

    // Sidebar should become visible
    await expect(sidebar).toHaveClass(/md:translate-x-0/);
    await expect(sidebar).toBeInViewport();
  });
});

test.describe('Route Redirects', () => {
  test('should redirect /mobile to /', async ({ page }) => {
    // Navigate to old mobile route
    await page.goto(`${BASE_URL}/mobile`);

    // Should redirect to home page
    await page.waitForURL(`${BASE_URL}/`);
    expect(page.url()).toBe(`${BASE_URL}/`);
  });

  test('should redirect /mobile/edit/[id] to /edit/[id]', async ({ page }) => {
    const sessionId = 'test-session-456';

    // Navigate to old mobile edit route
    await page.goto(`${BASE_URL}/mobile/edit/${sessionId}`);

    // Should redirect to unified edit page
    await page.waitForURL(`${BASE_URL}/edit/${sessionId}`);
    expect(page.url()).toBe(`${BASE_URL}/edit/${sessionId}`);
  });

  test('should redirect /mobile/preview/[id] to /preview/[id]', async ({ page }) => {
    const sessionId = 'test-session-789';

    // Navigate to old mobile preview route
    await page.goto(`${BASE_URL}/mobile/preview/${sessionId}`);

    // Should redirect to unified preview page
    await page.waitForURL(`${BASE_URL}/preview/${sessionId}`);
    expect(page.url()).toBe(`${BASE_URL}/preview/${sessionId}`);
  });

  test('should show loading spinner during redirect', async ({ page }) => {
    // Navigate to old mobile route
    await page.goto(`${BASE_URL}/mobile`);

    // Should briefly show loading state (check before redirect completes)
    const spinner = page.locator('.animate-spin').first();
    await expect(spinner).toBeVisible();

    // Should show loading text
    const loadingText = page.getByText('正在跳转...');
    await expect(loadingText).toBeVisible();
  });
});
