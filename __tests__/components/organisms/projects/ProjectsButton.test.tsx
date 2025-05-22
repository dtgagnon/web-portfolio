import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProjectsButton from '@/components/organisms/projects/ProjectsButton';
import FullScreenModal from '@/components/molecules/FullScreenModal'; // Import FullScreenModal
import { ThemeProvider } from '@/providers/ThemeContext';

// Mock FullScreenModal and ProjectCarousel
vi.mock('@/components/molecules/FullScreenModal', () => ({
  __esModule: true,
  default: vi.fn(({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
    return (
      <div data-testid="fullscreen-modal" data-isopen={isOpen.toString()}>
        {children}
        <button data-testid="modal-close-button" onClick={onClose}>Close Modal</button>
      </div>
    );
  }),
}));

vi.mock('@/components/organisms/projects/ProjectCarousel', () => ({
  __esModule: true,
  default: () => <div data-testid="project-carousel-mock">Project Carousel Mock</div>,
}));

describe('ProjectsButton component', () => {
  const renderProjectsButton = () => {
    return render(
      <ThemeProvider>
        <ProjectsButton />
      </ThemeProvider>
    );
  };

  it('renders the projects button', () => {
    renderProjectsButton();
    const button = screen.getByTestId('projects-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Projects');
  });

  it('opens the FullScreenModal with ProjectCarousel when clicked, and closes it', async () => {
    const FullScreenModalMock = vi.mocked(FullScreenModal);
    renderProjectsButton();

    // Initially the modal should not be visible
    expect(screen.queryByTestId('fullscreen-modal')).not.toBeInTheDocument();
    expect(FullScreenModalMock).toHaveBeenCalledWith(expect.objectContaining({ isOpen: false }), undefined);

    // Click the Projects button
    const projectsButton = screen.getByTestId('projects-button');
    await act(async () => {
      fireEvent.click(projectsButton);
    });

    // Now the modal should be visible and contain the ProjectCarousel mock
    expect(FullScreenModalMock).toHaveBeenLastCalledWith(expect.objectContaining({ isOpen: true }), undefined);
    expect(screen.getByTestId('fullscreen-modal')).toBeInTheDocument();
    expect(screen.getByTestId('project-carousel-mock')).toBeInTheDocument();

    // Simulate closing the modal (e.g., by clicking the mocked close button inside FullScreenModal)
    const closeButton = screen.getByTestId('modal-close-button');
    await act(async () => {
      fireEvent.click(closeButton);
    });

    // Modal should be closed again
    expect(FullScreenModalMock).toHaveBeenLastCalledWith(expect.objectContaining({ isOpen: false }), undefined);
    expect(screen.queryByTestId('fullscreen-modal')).not.toBeInTheDocument();
  });
});
