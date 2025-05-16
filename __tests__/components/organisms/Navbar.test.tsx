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

vi.mock('@/components/molecules', () => ({
  NavLink: ({ href, children, className, onClick }: { href: string; children: React.ReactNode; className?: string; onClick?: (e: React.MouseEvent) => void }) => (
    <a 
      href={href} 
      className={className} 
      data-testid="nav-link"
      onClick={onClick}
    >
      {children}
    </a>
  ),
  SocialLinks: ({ direction, iconSize }: { direction: string; iconSize: string }) => (
    <div data-testid="social-links" data-direction={direction} data-icon-size={iconSize}>
      Social Links
    </div>
  ),
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
    render(
      <ThemeProvider>
        <Navbar />
      </ThemeProvider>
    );
    
    // Check that navigation links exist
    const navLinks = screen.getAllByTestId('nav-link');
    expect(navLinks.length).toBe(2);
    
    expect(navLinks[0]).toHaveTextContent('About');
    expect(navLinks[1]).toHaveTextContent('Projects');
    
    // Check that resume button exists
    const resumeButton = screen.getByTestId('resume-button');
    expect(resumeButton).toBeInTheDocument();
    expect(resumeButton).toHaveTextContent('Resume');
  });

  it('has correct navigation styling', () => {
    render(
      <ThemeProvider>
        <Navbar />
      </ThemeProvider>
    );
    
    // Check that container has flex layout
    const navElement = screen.getByRole('navigation');
    expect(navElement).toHaveClass('flex', 'justify-between', 'items-center');
    
    // Check that links container has correct gap spacing
    const linksContainer = navElement.childNodes[1];
    expect(linksContainer).toHaveClass('gap-6', 'md:gap-8');
  });

  it('positions logo and navigation correctly', () => {
    render(
      <ThemeProvider>
        <Navbar />
      </ThemeProvider>
    );
    
    // Get the nav element and its children
    const navElement = screen.getByRole('navigation');
    const logoElement = screen.getByTestId('logo');
    const navLinks = screen.getAllByTestId('nav-link');
    
    // Logo should be the first child of nav
    expect(navElement.firstChild).toBe(logoElement);
    
    // Navigation links should be in a container that's the second child
    const linksContainer = navElement.childNodes[1];
    expect(linksContainer).toContainElement(navLinks[0]);
  });

  it('applies custom className when provided', () => {
    render(
      <ThemeProvider>
        <Navbar className="custom-class" />
      </ThemeProvider>
    );
    
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('custom-class');
  });
  
  it('renders the resume button', () => {
    render(
      <ThemeProvider>
        <Navbar />
      </ThemeProvider>
    );
    
    // Find the resume button
    const resumeButton = screen.getByTestId('resume-button');
    expect(resumeButton).toBeInTheDocument();
    expect(resumeButton).toHaveTextContent('Resume');
  });
});
