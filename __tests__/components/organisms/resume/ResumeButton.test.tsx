import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ResumeButton from '@/components/organisms/resume/ResumeButton';
import { ThemeProvider } from '@/providers/ThemeContext';

// Mock the ResumeCard component
vi.mock('@/components/organisms/resume/ResumeCard', () => ({
  __esModule: true,
  default: ({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (isOpen: boolean) => void }) => (
    isOpen ? (
      <div data-testid="resume-modal">
        <button onClick={() => setIsOpen(false)}>Close</button>
        Resume Content
      </div>
    ) : null
  )
}));

describe('ResumeButton component', () => {
  it('renders the resume button', () => {
    render(
      <ThemeProvider>
        <ResumeButton />
      </ThemeProvider>
    );
    
    const button = screen.getByTestId('resume-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Resume');
  });

  it('opens the resume modal when clicked', () => {
    render(
      <ThemeProvider>
        <ResumeButton />
      </ThemeProvider>
    );
    
    // Initially the resume modal should not be visible
    expect(screen.queryByTestId('resume-modal')).not.toBeInTheDocument();
    
    // Click the Resume button
    const resumeButton = screen.getByTestId('resume-button');
    fireEvent.click(resumeButton);
    
    // Now the resume modal should be visible
    expect(screen.getByTestId('resume-modal')).toBeInTheDocument();
    
    // Click the close button to close the modal
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    
    // Modal should be closed again
    expect(screen.queryByTestId('resume-modal')).not.toBeInTheDocument();
  });
});
