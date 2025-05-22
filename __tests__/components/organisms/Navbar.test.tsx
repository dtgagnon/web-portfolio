import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Navbar } from '@/components/organisms';
import { ThemeProvider } from '@/providers/ThemeContext';

// Mock the atomic components used in Navbar
vi.mock('@/components/atoms', () => ({
  Logo: ({ href, withText }: { href: string; withText?: boolean }) => (
    <a href={href} data-testid="logo" data-with-text={withText}>
      Logo
    </a>
  ),
}));

import { act } from '@testing-library/react';

// Keep existing mocks and add new ones
const NavLinkMock = ({ href, children, className, onClick }: { href: string; children: React.ReactNode; className?: string; onClick?: (e: React.MouseEvent) => void }) => (
  <a 
    href={href} 
    className={className} 
    data-testid="nav-link"
    onClick={onClick}
  >
    {children}
  </a>
);

vi.mock('@/components/molecules', async (importOriginal) => {
  const actual = await importOriginal() as any;
  return {
    ...actual,
    NavLink: NavLinkMock, // Use the defined mock for NavLink
    FullScreenModal: vi.fn(({ isOpen, onClose, children }) => {
      if (!isOpen) return null;
      return (
        <div data-testid="fullscreen-modal" data-isopen={isOpen}>
          {children}
          <button data-testid="modal-close-button" onClick={onClose}>Close Modal</button>
        </div>
      );
    }),
    // Keep SocialLinks if it's used, or add a generic mock
    SocialLinks: ({ direction, iconSize }: { direction: string; iconSize: string }) => (
      <div data-testid="social-links" data-direction={direction} data-icon-size={iconSize}>
        Social Links
      </div>
    ),
  };
});


vi.mock('@/components/organisms/ProjectCarousel', () => ({
  default: () => <div data-testid="project-carousel">Project Carousel Mock</div>,
}));

// Mock the ResumeButton component
vi.mock('@/components/organisms/resume/ResumeButton', () => ({
  default: () => (
    <button
      data-testid="resume-button"
    >
      Resume
    </button>
  )
}));

describe('Navbar component', () => {
  // Helper to render with ThemeProvider
  const renderNavbar = (props = {}) => {
    return render(
      <ThemeProvider>
        <Navbar {...props} />
      </ThemeProvider>
    );
  };

  it('renders the logo with correct props', () => {
    render(
      <ThemeProvider>
        <Navbar />
      </ThemeProvider>
    );
    
    const logo = screen.getByTestId('logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('href', '/');
    expect(logo).toHaveAttribute('data-with-text', 'false');
  });

  it('renders navigation links and resume button', () => {
    renderNavbar();
    
    // Check that "About" NavLink exists
    const aboutLink = screen.getByText('About');
    expect(aboutLink.closest('a')).toHaveAttribute('data-testid', 'nav-link');
    expect(aboutLink.closest('a')).toHaveAttribute('href', '/about');

    // Check that "Projects" button exists (it's not a NavLink component anymore)
    const projectsButton = screen.getByRole('button', { name: /projects/i });
    expect(projectsButton).toBeInTheDocument();
    
    // Check that resume button exists
    const resumeButton = screen.getByTestId('resume-button');
    expect(resumeButton).toBeInTheDocument();
    expect(resumeButton).toHaveTextContent('Resume');
  });

  it('has correct navigation styling', () => {
    renderNavbar();
    
    // Check that container has flex layout
    const navElement = screen.getByRole('navigation');
    expect(navElement).toHaveClass('flex', 'justify-between', 'items-center');
    
    // Check that links container has correct gap spacing
    const linksContainer = navElement.childNodes[1];
    expect(linksContainer).toHaveClass('gap-6', 'md:gap-8');
  });

  it('positions logo and navigation correctly', () => {
    renderNavbar();
    
    // Get the nav element and its children
    const navElement = screen.getByRole('navigation');
    const logoElement = screen.getByTestId('logo');
    const aboutLink = screen.getByText('About').closest('a'); // NavLink for "About"
    const projectsButton = screen.getByRole('button', { name: /projects/i }); // Button for "Projects"
    
    // Logo should be the first child of nav
    expect(navElement.firstChild).toBe(logoElement);
    
    // Navigation items should be in a container that's the second child
    const linksContainer = navElement.childNodes[1];
    expect(linksContainer).toContainElement(aboutLink!);
    expect(linksContainer).toContainElement(projectsButton);
  });

  it('applies custom className when provided', () => {
    renderNavbar({ className: 'custom-class' });
    
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('custom-class');
  });
  
  it('renders the resume button', () => {
    renderNavbar();
    
    // Find the resume button
    const resumeButton = screen.getByTestId('resume-button');
    expect(resumeButton).toBeInTheDocument();
    expect(resumeButton).toHaveTextContent('Resume');
  });

  describe('Project Carousel Modal Interaction', () => {
    it('renders the "Projects" button', () => {
      renderNavbar();
      const projectsButton = screen.getByRole('button', { name: /projects/i });
      expect(projectsButton).toBeInTheDocument();
    });

    it('opens the modal when "Projects" button is clicked, and renders ProjectCarousel', async () => {
      const FullScreenModalMock = vi.mocked(require('@/components/molecules').FullScreenModal);
      renderNavbar();
      
      const projectsButton = screen.getByRole('button', { name: /projects/i });
      
      // Modal should not be visible initially
      expect(screen.queryByTestId('fullscreen-modal')).not.toBeInTheDocument();
      expect(FullScreenModalMock).toHaveBeenLastCalledWith(expect.objectContaining({ isOpen: false }), {});


      await act(async () => {
        fireEvent.click(projectsButton);
      });
      
      // Check if FullScreenModal is called with isOpen: true
      expect(FullScreenModalMock).toHaveBeenLastCalledWith(expect.objectContaining({ isOpen: true }), {});
      
      // Check if the modal content (mocked) is rendered
      expect(screen.getByTestId('fullscreen-modal')).toBeInTheDocument();
      expect(screen.getByTestId('fullscreen-modal')).toHaveAttribute('data-isopen', 'true');
      expect(screen.getByTestId('project-carousel')).toBeInTheDocument(); // Check for mocked ProjectCarousel
    });

    it('closes the modal when onClose is triggered from FullScreenModal', async () => {
      const FullScreenModalMock = vi.mocked(require('@/components/molecules').FullScreenModal);
      renderNavbar();

      const projectsButton = screen.getByRole('button', { name: /projects/i });
      await act(async () => {
        fireEvent.click(projectsButton); // Open the modal
      });

      // Modal should be open
      expect(FullScreenModalMock).toHaveBeenLastCalledWith(expect.objectContaining({ isOpen: true }), {});
      expect(screen.getByTestId('fullscreen-modal')).toBeInTheDocument();

      // Simulate onClose being called (e.g., by clicking the mocked close button inside FullScreenModal)
      const closeButton = screen.getByTestId('modal-close-button');
      await act(async () => {
        fireEvent.click(closeButton);
      });

      // Modal should be closed
      expect(FullScreenModalMock).toHaveBeenLastCalledWith(expect.objectContaining({ isOpen: false }), {});
      expect(screen.queryByTestId('fullscreen-modal')).not.toBeInTheDocument();
    });
  });
});
