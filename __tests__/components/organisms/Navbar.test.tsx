import { render, screen } from '@testing-library/react';
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
  NavLink: ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
    <a href={href} className={className} data-testid="nav-link">
      {children}
    </a>
  ),
  SocialLinks: ({ direction, iconSize }: { direction: string; iconSize: string }) => (
    <div data-testid="social-links" data-direction={direction} data-icon-size={iconSize}>
      Social Links
    </div>
  ),
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
    expect(logo).toHaveAttribute('data-with-text', 'true');
  });

  it('renders navigation links', () => {
    render(
      <ThemeProvider>
        <Navbar />
      </ThemeProvider>
    );
    
    // Check that all expected navigation links exist
    const navLinks = screen.getAllByTestId('nav-link');
    expect(navLinks.length).toBe(3);
    
    expect(navLinks[0]).toHaveTextContent('About');
    expect(navLinks[1]).toHaveTextContent('Projects');
    expect(navLinks[2]).toHaveTextContent('Resume');
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
});
