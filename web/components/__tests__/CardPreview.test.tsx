/**
 * Tests for CardPreview component
 *
 * Following TDD principles:
 * 1. Watch tests fail first
 * 2. Implement minimal code to pass
 * 3. Refactor if needed
 */

import { render, screen } from '@testing-library/react';
import CardPreview from '../CardPreview';

// Mock html2canvas
jest.mock('html2canvas', () => ({
  __esModule: true,
  default: jest.fn(() =>
    Promise.resolve({
      toDataURL: () => 'data:image/png;base64,mock-image-data',
    })
  ),
}));

// Mock marked
jest.mock('marked', () => ({
  marked: {
    parse: jest.fn((md: string) => {
      // Simple markdown mock
      return md
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/\n\n/gim, '</p><p>')
        .replace(/^(?!<)/gim, '<p>')
        .replace(/(?<![>])$/gim, '</p>');
    }),
  },
}));

// Mock fetch for template and CSS
const mockCardTemplate = `
<!DOCTYPE html>
<html>
<head><title>Card</title></head>
<body>
  <div class="card-container">
    <div class="card-content">{{CONTENT}}</div>
  </div>
</body>
</html>
`;

global.fetch = jest.fn((url: string) => {
  if (url.includes('card.html')) {
    return Promise.resolve({
      ok: true,
      text: () => Promise.resolve(mockCardTemplate),
    });
  }
  return Promise.resolve({
    ok: true,
    text: () => Promise.resolve('mock css'),
  });
}) as jest.Mock;

describe('CardPreview Component', () => {
  const defaultProps = {
    markdown: '# Test Content',
    theme: 'default' as const,
    mode: 'separator' as const,
    onCapture: jest.fn(),
  };

  it('should render card container', () => {
    render(<CardPreview {...defaultProps} />);
    expect(screen.getByTestId('card-preview')).toBeInTheDocument();
  });

  it('should render markdown content', async () => {
    render(<CardPreview {...defaultProps} />);
    // Wait for async useEffect to complete
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should render capture button', () => {
    render(<CardPreview {...defaultProps} />);
    expect(screen.getByRole('button', { name: /capture/i })).toBeInTheDocument();
  });

  it('should render download button', () => {
    render(<CardPreview {...defaultProps} />);
    expect(screen.getByRole('button', { name: /download/i })).toBeInTheDocument();
  });
});
