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
    const { container } = render(<Resume isOpen={true} setIsOpen={mockSetIsOpen} />);
    
    // Check that the modal content is rendered
    expect(screen.getByTestId('mock-resume-content')).toBeInTheDocument();
    
    // Check for modal background without checking specific styles
    const overlay = container.firstChild as HTMLElement;
    expect(overlay).toBeTruthy();
  });

  it('has the expected modal structure', () => {
    const { container } = render(<Resume isOpen={true} setIsOpen={mockSetIsOpen} />);
    
    // Modal should have a close button
    const closeButton = screen.getByLabelText('Close');
    expect(closeButton).toBeInTheDocument();
    
    // Modal should contain the resume content
    expect(screen.getByTestId('mock-resume-content')).toBeInTheDocument();
    
    // The overlay should be a parent of the content
    const overlay = container.firstChild as HTMLElement;
    const resumeContent = screen.getByTestId('mock-resume-content');
    expect(overlay).toContainElement(resumeContent);
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
    const { container } = render(<Resume isOpen={true} setIsOpen={mockSetIsOpen} />);
    
    // Mock event for clicking outside
    const overlay = container.firstChild as HTMLElement;
    fireEvent.mouseDown(overlay);
    
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
  
  it('has appropriate layout structure', () => {
    render(<Resume isOpen={true} setIsOpen={mockSetIsOpen} />);
    
    // Find resume content in the modal
    const resumeContent = screen.getByTestId('mock-resume-content');
    expect(resumeContent).toBeInTheDocument();
    
    // Check that content exists in proper hierarchy
    const contentContainer = resumeContent.closest('div');
    expect(contentContainer).toBeTruthy();
    
    // Check for close button in header
    const closeButton = screen.getByLabelText('Close');
    expect(closeButton).toBeInTheDocument();
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
