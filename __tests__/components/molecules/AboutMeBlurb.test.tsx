import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AboutMeBlurb from '@/components/molecules/AboutMeBlurb';

// Mock the FullScreenModal component
vi.mock('@/components/molecules/FullScreenModal', () => {
  return {
    default: function MockFullScreenModal({ isOpen, onClose, children }: any) {
      return isOpen ? (
        <div data-testid="mock-modal">
          <button onClick={onClose} data-testid="mock-close-button">Close</button>
          {children}
        </div>
      ) : null;
    }
  };
});

describe('AboutMeBlurb', () => {
  it('renders the blurb text', () => {
    render(<AboutMeBlurb />);
    
    expect(screen.getByText(/medical device engineer/i)).toBeInTheDocument();
    expect(screen.getByText(/everything engineer/i)).toBeInTheDocument();
  });

  it('includes a button to view more information', () => {
    render(<AboutMeBlurb />);
    
    const readMoreButton = screen.getByRole('button', { name: /more about me/i });
    expect(readMoreButton).toBeInTheDocument();
  });

  it('opens modal when read more button is clicked', () => {
    render(<AboutMeBlurb />);
    
    const readMoreButton = screen.getByRole('button', { name: /more about me/i });
    fireEvent.click(readMoreButton);
    
    const modal = screen.getByTestId('mock-modal');
    expect(modal).toBeInTheDocument();
  });

  it('closes modal when close button is clicked', () => {
    render(<AboutMeBlurb />);
    
    // Open the modal
    const readMoreButton = screen.getByRole('button', { name: /more about me/i });
    fireEvent.click(readMoreButton);
    
    // Verify modal is open
    expect(screen.getByTestId('mock-modal')).toBeInTheDocument();
    
    // Click close button
    const closeButton = screen.getByTestId('mock-close-button');
    fireEvent.click(closeButton);
    
    // Verify modal is closed
    expect(screen.queryByTestId('mock-modal')).not.toBeInTheDocument();
  });
});
