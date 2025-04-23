import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import NavLink from '@/components/molecules/NavLink';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn()
}));

// Mock next/link
vi.mock('next/link', () => {
  return {
    __esModule: true,
    default: ({ href, className, onClick, children }: { href: string; className?: string; onClick?: () => void; children: React.ReactNode }) => (
      <a href={href} className={className} onClick={onClick}>
        {children}
      </a>
    )
  };
});

// Import the mocked hook
import { usePathname } from 'next/navigation';

describe('NavLink component', () => {
  const mockUsePathname = usePathname as jest.Mock;
  
  beforeEach(() => {
    mockUsePathname.mockReset();
  });
  
  it('renders children correctly', () => {
    mockUsePathname.mockReturnValue('/');
    
    render(<NavLink href="/about">About</NavLink>);
    
    expect(screen.getByText('About')).toBeInTheDocument();
  });
  
  it('renders as a link with the correct href', () => {
    mockUsePathname.mockReturnValue('/');
    
    render(<NavLink href="/about">About</NavLink>);
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/about');
  });
  
  it('applies active class when pathname matches href exactly', () => {
    mockUsePathname.mockReturnValue('/about');
    
    render(<NavLink href="/about">About</NavLink>);
    
    const link = screen.getByRole('link');
    expect(link).toHaveClass('font-semibold', 'text-sky-600', 'dark:text-sky-400');
  });
  
  it('applies active class when pathname is a subpath of href', () => {
    mockUsePathname.mockReturnValue('/about/me');
    
    render(<NavLink href="/about">About</NavLink>);
    
    const link = screen.getByRole('link');
    expect(link).toHaveClass('font-semibold', 'text-sky-600', 'dark:text-sky-400');
  });
  
  it('does not apply active class when pathname does not match href', () => {
    mockUsePathname.mockReturnValue('/contact');
    
    render(<NavLink href="/about">About</NavLink>);
    
    const link = screen.getByRole('link');
    expect(link).not.toHaveClass('font-semibold', 'text-sky-600', 'dark:text-sky-400');
  });
  
  it('applies custom className', () => {
    mockUsePathname.mockReturnValue('/');
    
    render(<NavLink href="/about" className="test-class">About</NavLink>);
    
    const link = screen.getByRole('link');
    expect(link).toHaveClass('test-class');
  });
  
  it('applies custom activeClassName when active', () => {
    mockUsePathname.mockReturnValue('/about');
    
    render(
      <NavLink 
        href="/about" 
        activeClassName="custom-active-class"
      >
        About
      </NavLink>
    );
    
    const link = screen.getByRole('link');
    expect(link).toHaveClass('custom-active-class');
    expect(link).not.toHaveClass('font-semibold', 'text-sky-600', 'dark:text-sky-400');
  });
  
  it('calls onClick handler when clicked', () => {
    mockUsePathname.mockReturnValue('/');
    const handleClick = vi.fn();
    
    render(<NavLink href="/about" onClick={handleClick}>About</NavLink>);
    
    const link = screen.getByRole('link');
    fireEvent.click(link);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  it('applies hover classes for interactivity', () => {
    mockUsePathname.mockReturnValue('/');
    
    render(<NavLink href="/about">About</NavLink>);
    
    const link = screen.getByRole('link');
    expect(link).toHaveClass('hover:text-sky-600', 'dark:hover:text-sky-400', 'transition-colors');
  });
});
