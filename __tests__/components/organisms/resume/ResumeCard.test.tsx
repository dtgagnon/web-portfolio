import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Resume from '@/components/organisms/resume/ResumeCard';

// Mock the ResumeContent component
vi.mock('@/components/organisms/resume/ResumeContent', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-resume-content">Resume Content</div>
}));

describe('Resume component', () => {
  // Common props used across tests
  const mockSetIsOpen = vi.fn();
  
  beforeEach(() => {
    // Reset mocks before each test
    mockSetIsOpen.mockReset();
    vi.resetModules();
  });
  
  it('renders nothing when isOpen is false', () => {
    const { container } = render(<Resume isOpen={false} setIsOpen={mockSetIsOpen} />);
    expect(container.firstChild).toBeNull();
  });
  
  it('renders resume modal when isOpen is true', () => {
    render(<Resume isOpen={true} setIsOpen={mockSetIsOpen} />);
    
    // Check for modal background
    const modalBackground = screen.getByText('Resume Content').closest('div')?.parentElement;
    expect(modalBackground).toHaveClass('fixed', 'inset-0', 'bg-black/50');
    
    // Check for resume content
    expect(screen.getByTestId('mock-resume-content')).toBeInTheDocument();
  });
  
  it('closes when close button is clicked', () => {
    render(<Resume isOpen={true} setIsOpen={mockSetIsOpen} />);
    
    // Find and click close button
    const closeButton = screen.getByLabelText('Close');
    fireEvent.click(closeButton);
    
    // Verify setIsOpen was called with false
    expect(mockSetIsOpen).toHaveBeenCalledWith(false);
  });
  
  it('closes when clicking outside the resume', () => {
    render(<Resume isOpen={true} setIsOpen={mockSetIsOpen} />);
    
    // Mock event for clicking outside
    const modalBackground = screen.getByText('Resume Content').closest('div')?.parentElement;
    fireEvent.mouseDown(modalBackground as HTMLElement);
    
    // Verify setIsOpen was called with false
    expect(mockSetIsOpen).toHaveBeenCalledWith(false);
  });
  
  it('does not close when clicking inside the resume', () => {
    render(<Resume isOpen={true} setIsOpen={mockSetIsOpen} />);
    
    // Click inside the resume content
    const resumeContent = screen.getByTestId('mock-resume-content');
    fireEvent.mouseDown(resumeContent);
    
    // Verify setIsOpen was not called
    expect(mockSetIsOpen).not.toHaveBeenCalled();
  });
  
  it('closes when Escape key is pressed', () => {
    render(<Resume isOpen={true} setIsOpen={mockSetIsOpen} />);
    
    // Simulate Escape key press
    fireEvent.keyDown(window, { key: 'Escape' });
    
    // Verify setIsOpen was called with false
    expect(mockSetIsOpen).toHaveBeenCalledWith(false);
  });
  
  it('does not close when other keys are pressed', () => {
    render(<Resume isOpen={true} setIsOpen={mockSetIsOpen} />);
    
    // Simulate pressing a different key
    fireEvent.keyDown(window, { key: 'Enter' });
    
    // Verify setIsOpen was not called
    expect(mockSetIsOpen).not.toHaveBeenCalled();
  });
  
  it('has appropriate styling for the resume container', () => {
    render(<Resume isOpen={true} setIsOpen={mockSetIsOpen} />);
    
    // Find resume container (parent of resume content)
    const resumeContainer = screen.getByTestId('mock-resume-content').closest('div');
    
    // Check for proper styling
    expect(resumeContainer).toHaveClass(
      'bg-white', 
      'dark:bg-black', 
      'w-full', 
      'max-w-6xl', 
      'h-[calc(100vh-4rem)]', 
      'overflow-auto', 
      'rounded-lg', 
      'shadow-xl'
    );
    
    // Check for proper aspect ratio (letter paper)
    expect(resumeContainer).toHaveStyle({ aspectRatio: '8.5/11' });
  });
  
  it('has a sticky header with close button', () => {
    render(<Resume isOpen={true} setIsOpen={mockSetIsOpen} />);
    
    // Find the sticky header
    const stickyHeader = screen.getByLabelText('Close').closest('div');
    
    // Check for proper styling
    expect(stickyHeader).toHaveClass(
      'sticky', 
      'top-0', 
      'flex', 
      'justify-end', 
      'p-2', 
      'bg-white', 
      'dark:bg-black', 
      'border-b'
    );
  });
});
