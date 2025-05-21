import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Hero from '@/components/organisms/Hero';

// Mock Next.js Image component
vi.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, className }: { src: string; alt: string; className?: string }) => (
    <img 
      src={src} 
      alt={alt} 
      className={className} 
      data-testid="mock-image" 
    />
  )
}));

interface MockButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  className?: string;
}

interface MockProfileImageProps {
  src: string;
  alt: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | string; // Allow string for data-size flexibility
  priority?: boolean;
  style?: React.CSSProperties;
}

// Mock the '@/components/atoms' module
vi.mock('@/components/atoms', () => ({
  __esModule: true, // Important for modules with default exports if they also have named
  Button: ({ children, onClick, variant, size, className }: MockButtonProps) => (
    <button
      onClick={onClick}
      data-variant={variant}
      data-size={size}
      className={className}
      data-testid="mock-button" // Added for clarity
    >
      {children}
    </button>
  ),
  ProfileImage: ({ src, alt, className, size, priority, style }: MockProfileImageProps) => {
    const passedClassName = className || '';
    const finalClassName = `rounded-full ${passedClassName}`.trim(); // Ensure 'rounded-full' is always present
    return (
      <img
        src={src}
        alt={alt}
        className={finalClassName}
        data-testid="mock-profile-image"
        data-size={size} // size is already string or undefined
        data-priority={priority}
        style={style}
      />
    );
  }
}));

describe('Hero component', () => {
  it('renders title and subtitle correctly', () => {
    render(
      <Hero 
        title="Welcome to My Portfolio" 
        subtitle="I create innovative solutions" 
      />
    );
    
    expect(screen.getByText('Welcome to My Portfolio')).toBeInTheDocument();
    expect(screen.getByText('I create innovative solutions')).toBeInTheDocument();
  });
  
  it('renders hero image with correct props', () => {
    render(<Hero title="Welcome" imageSrc="/images/custom.jpg" />);
    
    const image = screen.getByTestId('mock-profile-image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/images/custom.jpg');
    expect(image).toHaveAttribute('alt', 'Derek headshot image');
    expect(image).toHaveClass('rounded-full');
  });
  
  it('uses default image src if not provided', () => {
    render(<Hero title="Welcome" />);
    
    const image = screen.getByTestId('mock-profile-image');
    expect(image).toHaveAttribute('src', '/images/profile.jpg');
  });
  
  it('renders CTA button with correct text', () => {
    render(<Hero title="Welcome" ctaText="See My Work" />);
    
    const button = screen.getByTestId('mock-button');
    expect(button).toHaveTextContent('See My Work');
  });
  
  it('uses default CTA text if not provided', () => {
    render(<Hero title="Welcome" />);
    
    const button = screen.getByTestId('mock-button');
    expect(button).toHaveTextContent('View Projects');
  });
  
  it('sets button onClick to navigate to ctaLink', () => {
    const mockHref = '/custom-page';
    const originalLocation = window.location;

    // Create a mock location object with a spyable href setter
    let currentHref = '';
    const hrefSetterSpy = vi.fn((newHref) => { currentHref = newHref; });

    delete (window as any).location;
    const mockLocation = {
      ...originalLocation, // spread other properties if needed
      assign: vi.fn(), // keep assign mock if other parts rely on it, or simplify
      // Define href with a getter and our spyable setter
      get href() {
        return currentHref;
      },
      set href(newHref: string) {
        hrefSetterSpy(newHref);
      }
    };
    (window as any).location = mockLocation;

    render(<Hero title="Welcome" ctaLink={mockHref} />);    
    const button = screen.getByTestId('mock-button');
    button.click();
    
    expect(hrefSetterSpy).toHaveBeenCalledWith(mockHref);
    
    // Restore the original window.location
    (window as any).location = originalLocation;
  });
  
  it('applies correct button styling', () => {
    render(<Hero title="Welcome" />);
    
    const button = screen.getByTestId('mock-button');
    expect(button).toHaveAttribute('data-variant', 'primary');
    expect(button).toHaveAttribute('data-size', 'lg');
  });
  
  it('applies custom className', () => {
    const { container } = render(<Hero title="Welcome" className="test-class" />);
    
    const section = container.querySelector('section');
    expect(section).toHaveClass('test-class');
  });
  
  it('handles imagePosition prop correctly', () => {
    // Test default right position
    const { container, rerender } = render(<Hero title="Welcome" />);
    
    let gridContainer = container.querySelector('.grid');
    expect(gridContainer).not.toHaveClass('md:flex-row-reverse');
    
    // Test left position
    rerender(<Hero title="Welcome" imagePosition="left" />);
    
    gridContainer = container.querySelector('.grid');
    expect(gridContainer).toHaveClass('md:flex-row-reverse');
  });
  
  it('renders with responsive layout classes', () => {
    const { container } = render(<Hero title="Welcome" />);
    
    const section = container.querySelector('section');
    expect(section).toHaveClass('py-12', 'md:py-24');
    
    const mainContainer = container.querySelector('.max-w-7xl');
    expect(mainContainer).toHaveClass('mx-auto', 'px-4', 'sm:px-6', 'lg:px-8');
    
    const gridContainer = container.querySelector('.grid');
    expect(gridContainer).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'gap-12', 'items-center');
  });
});
