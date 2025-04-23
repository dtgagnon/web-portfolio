import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Footer from '@/components/organisms/Footer';

// Mock child components
vi.mock('@/components/atoms', () => ({
  Logo: ({ withText, size }: { withText: boolean; size: string }) => (
    <div data-testid="mock-logo" data-with-text={withText} data-size={size}>Logo</div>
  ),
}));

vi.mock('@/components/molecules', () => ({
  NavLink: ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
    <a href={href} className={className} data-testid="mock-nav-link">{children}</a>
  ),
  SocialLinks: ({ direction, iconSize }: { direction: string; iconSize: string }) => (
    <div data-testid="mock-social-links" data-direction={direction} data-icon-size={iconSize}>
      Social Links
    </div>
  ),
}));

describe('Footer component', () => {
  it('renders logo and tagline', () => {
    render(<Footer />);
    
    const logo = screen.getByTestId('mock-logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('data-with-text', 'true');
    expect(logo).toHaveAttribute('data-size', 'sm');
    
    const tagline = screen.getByText(/medical device engineer/i);
    expect(tagline).toBeInTheDocument();
  });
  
  it('renders navigation links', () => {
    render(<Footer />);
    
    const navLinks = screen.getAllByTestId('mock-nav-link');
    expect(navLinks).toHaveLength(4); // Home, Projects, About, Contact
    
    // Verify navigation heading
    expect(screen.getByText('Navigation')).toBeInTheDocument();
    
    // Check nav link hrefs
    const hrefs = navLinks.map(link => link.getAttribute('href'));
    expect(hrefs).toContain('/');
    expect(hrefs).toContain('/projects');
    expect(hrefs).toContain('/about');
    expect(hrefs).toContain('/contact');
  });
  
  it('renders social links with correct props', () => {
    render(<Footer />);
    
    const socialLinks = screen.getByTestId('mock-social-links');
    expect(socialLinks).toBeInTheDocument();
    expect(socialLinks).toHaveAttribute('data-direction', 'column');
    expect(socialLinks).toHaveAttribute('data-icon-size', 'sm');
    
    // Verify connect heading
    expect(screen.getByText('Connect')).toBeInTheDocument();
  });
  
  it('renders copyright notice with current year', () => {
    // Mock the Date constructor to return a fixed date
    const originalDate = global.Date;
    const mockDate = new Date(2025, 3, 22); // April 22, 2025
    global.Date = class extends Date {
      constructor() {
        super();
        return mockDate;
      }
      getFullYear() {
        return 2025;
      }
    } as typeof global.Date;
    
    render(<Footer />);
    
    expect(screen.getByText(/© 2025 Derek Gagnon/i)).toBeInTheDocument();
    
    // Restore the original Date
    global.Date = originalDate;
  });
  
  it('applies custom className', () => {
    const { container } = render(<Footer className="test-class" />);
    
    const footer = container.querySelector('footer');
    expect(footer).toHaveClass('test-class');
  });
  
  it('has appropriate styling classes', () => {
    const { container } = render(<Footer />);
    
    const footer = container.querySelector('footer');
    expect(footer).toHaveClass('bg-gray-50', 'dark:bg-gray-900', 'border-t');
    
    // Main container
    const mainContainer = footer?.querySelector('div');
    expect(mainContainer).toHaveClass('max-w-7xl', 'mx-auto');
    
    // Grid layout
    const gridContainer = mainContainer?.querySelector('div');
    expect(gridContainer).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-3');
  });
});
