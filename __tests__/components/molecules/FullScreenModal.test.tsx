import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import FullScreenModal from '@/components/molecules/FullScreenModal';

describe('FullScreenModal', () => {
  const mockOnClose = vi.fn();
  const testContent = <div data-testid="test-content">Test Content</div>;
  
  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it('should not render content when isOpen is false', () => {
    render(
      <FullScreenModal isOpen={false} onClose={mockOnClose}>
        {testContent}
      </FullScreenModal>
    );
    
    expect(screen.queryByTestId('test-content')).not.toBeInTheDocument();
  });

  it('should render content when isOpen is true', () => {
    render(
      <FullScreenModal isOpen={true} onClose={mockOnClose}>
        {testContent}
      </FullScreenModal>
    );
    
    expect(screen.getByTestId('test-content')).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    render(
      <FullScreenModal isOpen={true} onClose={mockOnClose}>
        {testContent}
      </FullScreenModal>
    );
    
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when overlay is clicked', () => {
    render(
      <FullScreenModal isOpen={true} onClose={mockOnClose}>
        {testContent}
      </FullScreenModal>
    );
    
    // Get the overlay element (the parent div with the backdrop)
    const overlay = screen.getByTestId('modal-overlay');
    fireEvent.click(overlay);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should not close when clicking inside the modal content', () => {
    render(
      <FullScreenModal isOpen={true} onClose={mockOnClose}>
        {testContent}
      </FullScreenModal>
    );
    
    const modalContent = screen.getByTestId('modal-content');
    fireEvent.click(modalContent);
    
    expect(mockOnClose).not.toHaveBeenCalled();
  });
});
