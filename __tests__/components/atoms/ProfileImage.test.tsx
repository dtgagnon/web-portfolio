import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProfileImage from '@/components/atoms/ProfileImage';

// Mock Next.js Image component
vi.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, fill, style, className, priority, sizes }: any) => (
    <img 
      src={src} 
      alt={alt} 
      className={className} 
      data-testid="mock-image" 
      data-fill={fill ? 'true' : 'false'}
      data-priority={priority ? 'true' : 'false'}
      data-sizes={sizes}
      style={style}
    />
  ),
}));

describe('ProfileImage component', () => {
  const defaultProps = {
    src: '/images/profile.jpg',
    alt: 'Test profile image'
  };

  it('renders with default props', () => {
    render(<ProfileImage {...defaultProps} />);
    
    // Should render the image
    const image = screen.getByTestId('mock-image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', defaultProps.src);
    expect(image).toHaveAttribute('alt', defaultProps.alt);
    expect(image).toHaveAttribute('data-fill', 'true');
    expect(image).toHaveAttribute('data-priority', 'false');
    
    // Container should have medium size by default
    const container = screen.getByTestId('profile-image-container');
    expect(container).toHaveClass('w-64', 'h-64', 'sm:w-64', 'sm:h-64');
    expect(container).toHaveClass('rounded-full', 'overflow-hidden');
  });
  
  it('applies different sizes based on size prop', () => {
    // Test small size
    const { unmount } = render(
      <ProfileImage {...defaultProps} size="sm" />
    );
    
    let profileContainer = screen.getByTestId('profile-image-container');
    expect(profileContainer).toHaveClass('w-48', 'h-48', 'sm:w-48', 'sm:h-48');
    expect(profileContainer).not.toHaveClass('w-64', 'h-64');
    
    unmount();
    
    // Test medium size (default)
    const { unmount: unmount2 } = render(
      <ProfileImage {...defaultProps} size="md" />
    );
    
    profileContainer = screen.getByTestId('profile-image-container');
    expect(profileContainer).toHaveClass('w-64', 'h-64', 'sm:w-64', 'sm:h-64');
    
    unmount2();
    
    // Test large size
    render(<ProfileImage {...defaultProps} size="lg" />);
    
    profileContainer = screen.getByTestId('profile-image-container');
    expect(profileContainer).toHaveClass('w-80', 'h-80', 'sm:w-80', 'sm:h-80');
  });
  
  it('applies priority prop when set to true', () => {
    render(<ProfileImage {...defaultProps} priority />);
    
    const image = screen.getByTestId('mock-image');
    expect(image).toHaveAttribute('data-priority', 'true');
  });
  
  it('applies custom className to container', () => {
    render(<ProfileImage {...defaultProps} className="custom-class" />);
    
    const container = screen.getByTestId('profile-image-container');
    expect(container).toHaveClass('custom-class');
  });
  
  it('adds shadow by default', () => {
    render(<ProfileImage {...defaultProps} />);
    
    const container = screen.getByTestId('profile-image-container');
    expect(container).toHaveClass('shadow-lg');
  });
  
  it('removes shadow when shadowed is false', () => {
    render(<ProfileImage {...defaultProps} shadowed={false} />);
    
    const container = screen.getByTestId('profile-image-container');
    expect(container).not.toHaveClass('shadow-lg');
  });
});
