/**
 * Tests for SaveButton component
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { SaveButton } from '../SaveButton';

// Mock html2canvas
jest.mock('html2canvas', () => ({
  __esModule: true,
  default: jest.fn(() =>
    Promise.resolve({
      toDataURL: jest.fn(() => 'data:image/png;base64,mock-data'),
    }),
  ),
}));

describe('SaveButton', () => {
  const mockOnGenerateImage = jest.fn(() =>
    Promise.resolve('data:image/png;base64,test-image')
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render save button with download icon', () => {
    render(
      <SaveButton
        sessionId="test-session"
        title="Test Title"
        onGenerateImage={mockOnGenerateImage}
      />
    );

    expect(screen.getByText('保存图片')).toBeInTheDocument();
  });

  it('should have red background (#E42313)', () => {
    const { container } = render(
      <SaveButton
        sessionId="test-session"
        title="Test Title"
        onGenerateImage={mockOnGenerateImage}
      />
    );

    const button = container.querySelector('button');
    expect(button).toHaveStyle({ backgroundColor: '#E42313' });
  });

  it('should have 24px border radius', () => {
    const { container } = render(
      <SaveButton
        sessionId="test-session"
        title="Test Title"
        onGenerateImage={mockOnGenerateImage}
      />
    );

    const button = container.querySelector('button');
    expect(button).toHaveStyle({ borderRadius: '24px' });
  });

  it('should have full width', () => {
    const { container } = render(
      <SaveButton
        sessionId="test-session"
        title="Test Title"
        onGenerateImage={mockOnGenerateImage}
      />
    );

    const button = container.querySelector('button');
    expect(button).toHaveStyle({ width: '100%' });
  });

  it('should have 14px vertical padding', () => {
    const { container } = render(
      <SaveButton
        sessionId="test-session"
        title="Test Title"
        onGenerateImage={mockOnGenerateImage}
      />
    );

    const button = container.querySelector('button');
    expect(button).toHaveStyle({ padding: '14px 20px' });
  });

  it('should use Space Grotesk font with 15px 600 weight', () => {
    render(
      <SaveButton
        sessionId="test-session"
        title="Test Title"
        onGenerateImage={mockOnGenerateImage}
      />
    );

    const text = screen.getByText('保存图片');
    expect(text).toHaveStyle({
      fontFamily: 'Space Grotesk',
      fontSize: '15px',
      fontWeight: '600',
    });
  });

  it('should have white text color', () => {
    render(
      <SaveButton
        sessionId="test-session"
        title="Test Title"
        onGenerateImage={mockOnGenerateImage}
      />
    );

    const text = screen.getByText('保存图片');
    expect(text).toHaveStyle({ color: '#FFFFFF' });
  });

  it('should call onGenerateImage when clicked', async () => {
    render(
      <SaveButton
        sessionId="test-session"
        title="Test Title"
        onGenerateImage={mockOnGenerateImage}
      />
    );

    const button = screen.getByText('保存图片');
    await userEvent.click(button);

    expect(mockOnGenerateImage).toHaveBeenCalled();
  });

  it('should show "保存中..." while saving', async () => {
    mockOnGenerateImage.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve('data:image/png;base64,test'), 100))
    );

    render(
      <SaveButton
        sessionId="test-session"
        title="Test Title"
        onGenerateImage={mockOnGenerateImage}
      />
    );

    const button = screen.getByRole('button');
    await userEvent.click(button);

    // Check for loading state
    expect(screen.getByText('保存中...')).toBeInTheDocument();
  });

  it('should disable button while saving', async () => {
    mockOnGenerateImage.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve('data:image/png;base64,test'), 100))
    );

    render(
      <SaveButton
        sessionId="test-session"
        title="Test Title"
        onGenerateImage={mockOnGenerateImage}
      />
    );

    const button = screen.getByRole('button');
    await userEvent.click(button);

    expect(button).toBeDisabled();
  });
});
