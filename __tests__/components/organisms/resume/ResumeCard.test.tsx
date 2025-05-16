import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ResumeCard from '@/components/organisms/resume/ResumeCard';

// Mock the FullScreenModal and ResumeContent components
vi.mock('@/components/molecules/FullScreenModal', () => ({
  __esModule: true,
  default: ({ isOpen, onClose, children, className }: { 
    isOpen: boolean; 
    onClose: () => void; 
    children: React.ReactNode;
    className?: string;
  }) => 
    isOpen ? (
      <div data-testid="mock-modal" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <button onClick={onClose} aria-label="Close">Close</button>
        <div data-testid="modal-content" className={className}>
          {children}
        </div>
      </div>
    ) : null
}));

vi.mock('@/components/organisms/resume/ResumeContent', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-resume-content">Resume Content</div>
}));

describe('ResumeCard', () => {
  const mockSetIsOpen = vi.fn();
  
  beforeEach(() => {
    mockSetIsOpen.mockClear();
    vi.clearAllMocks();
  });
  
  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <ResumeCard isOpen={false} setIsOpen={mockSetIsOpen} />
    );
    expect(container.firstChild).toBeNull();
  });
  
  it('renders modal content when isOpen is true', () => {
    render(<ResumeCard isOpen={true} setIsOpen={mockSetIsOpen} />);
    
    expect(screen.getByTestId('mock-modal')).toBeInTheDocument();
    expect(screen.getByTestId('mock-resume-content')).toBeInTheDocument();
  });
  
  it('calls setIsOpen with false when close button is clicked', () => {
    render(<ResumeCard isOpen={true} setIsOpen={mockSetIsOpen} />);
    
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    
    expect(mockSetIsOpen).toHaveBeenCalledWith(false);
  });
  
  it('calls setIsOpen with false when clicking outside the content', () => {
    render(<ResumeCard isOpen={true} setIsOpen={mockSetIsOpen} />);
    
    const modal = screen.getByTestId('mock-modal');
    fireEvent.click(modal);
    
    expect(mockSetIsOpen).toHaveBeenCalledWith(false);
  });
  
  it('does not call setIsOpen when clicking inside the content', () => {
    render(<ResumeCard isOpen={true} setIsOpen={mockSetIsOpen} />);
    
    const content = screen.getByTestId('modal-content');
    fireEvent.click(content);
    
    expect(mockSetIsOpen).not.toHaveBeenCalled();
  });
  
  it('applies the correct className to the modal content', () => {
    render(<ResumeCard isOpen={true} setIsOpen={mockSetIsOpen} />);
    
    const content = screen.getByTestId('modal-content');
    expect(content).toHaveClass('max-w-6xl');
    expect(content).toHaveClass('w-full');
    expect(content).toHaveClass('h-[90vh]');
    expect(content).toHaveClass('overflow-auto');
  });
});
