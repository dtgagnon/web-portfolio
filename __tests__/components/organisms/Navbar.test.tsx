import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Navbar from '@/components/organisms/Navbar';

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
    render(<Navbar />);
    
    const logo = screen.getByTestId('logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('href', '/');
    expect(logo).toHaveAttribute('data-with-text', 'true');
  });

  it('renders desktop navigation links', () => {
    render(<Navbar />);
    
    const navLinks = screen.getAllByTestId('nav-link');
    expect(navLinks.length).toBe(4); // 4 desktop links in the refactored version
    
    // Check desktop links (first 4 links)
    expect(navLinks[0]).toHaveAttribute('href', '/');
    expect(navLinks[0]).toHaveTextContent('Home');
    expect(navLinks[1]).toHaveAttribute('href', '/projects');
    expect(navLinks[1]).toHaveTextContent('Projects');
    expect(navLinks[2]).toHaveAttribute('href', '/about');
    expect(navLinks[2]).toHaveTextContent('About');
    expect(navLinks[3]).toHaveAttribute('href', '/contact');
    expect(navLinks[3]).toHaveTextContent('Contact');
  });

  it('renders SocialLinks components with correct props', () => {
    render(<Navbar />);
    
    const socialLinks = screen.getAllByTestId('social-links');
    expect(socialLinks.length).toBe(1); // Only desktop version in the refactored component
    
    // Desktop social links
    expect(socialLinks[0]).toHaveAttribute('data-direction', 'row');
    expect(socialLinks[0]).toHaveAttribute('data-icon-size', 'sm');
  });

  it('toggles mobile menu when the menu button is clicked', () => {
    render(<Navbar />);
    
    // Find the menu button
    const menuButton = screen.getByRole('button', { name: /open menu/i });
    expect(menuButton).toBeInTheDocument();
    
    // Click the menu button to open the menu
    fireEvent.click(menuButton);
    
    // The button should now be for closing the menu
    expect(screen.getByRole('button', { name: /close menu/i })).toBeInTheDocument();
    
    // Click the menu button again to close the menu
    fireEvent.click(screen.getByRole('button', { name: /close menu/i }));
    
    // The button should be back to open menu
    expect(screen.getByRole('button', { name: /open menu/i })).toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    render(<Navbar className="custom-class" />);
    
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('custom-class');
  });
});
