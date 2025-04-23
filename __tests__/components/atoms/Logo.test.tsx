import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Logo from '@/components/atoms/Logo';

// Mock Next.js Image component
vi.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, width, height, className }: { src: string; alt: string; width: number; height: number; className?: string }) => (
    <img 
      src={src} 
      alt={alt} 
      width={width} 
      height={height} 
      className={className} 
      data-testid="mock-image" 
    />
  ),
}));

// Mock Next.js Link component
vi.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) => (
    <a href={href} className={className} data-testid="mock-link">
      {children}
    </a>
  ),
}));

describe('Logo component', () => {
  it('renders the logo with default props', () => {
    const { container } = render(<Logo />);
    
    // Should render two images (main logo and hover effect)
    const images = screen.getAllByTestId('mock-image');
    expect(images.length).toBe(2);
    
    // Default size should be 'md' (60px)
    expect(images[0]).toHaveAttribute('width', '60');
    expect(images[0]).toHaveAttribute('height', '60');
    
    // Should be wrapped in a link with default href='/'
    const link = screen.getByTestId('mock-link');
    expect(link).toHaveAttribute('href', '/');
  });
  
  it('renders with correct size based on size prop', () => {
    const sizes = [
      { prop: 'sm', value: '40' },
      { prop: 'md', value: '60' },
      { prop: 'lg', value: '80' }
    ];
    
    sizes.forEach(({ prop, value }) => {
      const { unmount } = render(<Logo size={prop as 'sm' | 'md' | 'lg'} />);
      
      const images = screen.getAllByTestId('mock-image');
      expect(images[0]).toHaveAttribute('width', value);
      expect(images[0]).toHaveAttribute('height', value);
      
      unmount();
    });
  });
  
  it('includes text when withText is true', () => {
    render(<Logo withText={true} />);
    
    expect(screen.getByText('Derek Gagnon')).toBeInTheDocument();
  });
  
  it('does not include text when withText is false', () => {
    render(<Logo withText={false} />);
    
    expect(screen.queryByText('Derek Gagnon')).not.toBeInTheDocument();
  });
  
  it('applies custom className to container', () => {
    const { container } = render(<Logo className="test-class" />);
    
    const containerDiv = container.querySelector('div');
    expect(containerDiv).toHaveClass('test-class');
  });
  
  it('uses custom href when provided', () => {
    render(<Logo href="/test" />);
    
    const link = screen.getByTestId('mock-link');
    expect(link).toHaveAttribute('href', '/test');
  });
  
  it('does not wrap in link when href is not provided', () => {
    render(<Logo href="" />);
    
    expect(screen.queryByTestId('mock-link')).not.toBeInTheDocument();
  });
  
  it('applies focus-related classes to the link for accessibility', () => {
    render(<Logo />);
    
    const link = screen.getByTestId('mock-link');
    expect(link).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-sky-500', 'rounded-md');
  });
});
