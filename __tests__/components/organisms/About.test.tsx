import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import About from '@/components/organisms/About';

// Mock the Next.js Image component
vi.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, className }: { src: string; alt: string; className?: string }) => (
    <img src={src} alt={alt} className={className} data-testid="next-image" />
  ),
}));

// Mock the Card component
vi.mock('@/components/molecules', () => ({
  Card: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="card" className={className}>
      {children}
    </div>
  ),
}));

describe('About component', () => {
  it('renders the about section with correct heading', () => {
    render(<About />);
    
    expect(screen.getByText('About Me')).toBeInTheDocument();
    expect(screen.getByText('Skills & Expertise')).toBeInTheDocument();
  });

  it('displays the profile image with correct attributes', () => {
    render(<About />);
    
    const image = screen.getByTestId('next-image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/images/profile.jpg');
    expect(image).toHaveAttribute('alt', 'Derek Gagnon');
    expect(image).toHaveClass('rounded-lg');
  });

  it('renders the bio paragraphs', () => {
    render(<About />);
    
    expect(screen.getByText(/Hi! I'm a medical device engineer/)).toBeInTheDocument();
    expect(screen.getByText(/With extensive expertise in neurological conditions/)).toBeInTheDocument();
    expect(screen.getByText(/My analytical approach has helped organizations/)).toBeInTheDocument();
  });

  it('displays all skills with their expertise levels', () => {
    render(<About />);
    
    // Check for skill names
    expect(screen.getByText('Medical Device Development')).toBeInTheDocument();
    expect(screen.getByText('Neural Engineering')).toBeInTheDocument();
    expect(screen.getByText('Accessibility & Inclusive Design')).toBeInTheDocument();
    expect(screen.getByText('AI/ML in Healthcare')).toBeInTheDocument();
    
    // Check for expertise levels
    expect(screen.getAllByText('Expert').length).toBeGreaterThanOrEqual(3);
    expect(screen.getAllByText('Advanced').length).toBeGreaterThanOrEqual(4);
    expect(screen.getByText('Intermediate')).toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    const { container } = render(<About className="custom-class" />);
    
    // The custom class should be applied to the top-level div
    const topLevelDiv = container.firstChild as HTMLElement;
    expect(topLevelDiv).toHaveClass('custom-class');
  });

  it('renders skills in Card components', () => {
    render(<About />);
    
    // There should be 10 cards (one for each skill)
    const cards = screen.getAllByTestId('card');
    expect(cards.length).toBe(10);
  });
});
