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

// Mock the GearIcon component
vi.mock('@/components/atoms/icons', () => ({
  GearIcon: ({ className, size }: { className?: string; size: number }) => (
    <svg className={className} width={size} height={size} data-testid="gear-icon" />
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
    
    // Check for text that's split across elements
    const aboutSection = screen.getByText(/About Me/).closest('section');
    const aboutText = aboutSection?.textContent || '';
    
    expect(aboutText).toContain("I'm Derek Gagnon");
    expect(aboutText).toContain('Product Development Engineer with 9 years');
    expect(aboutText).toContain('electro-optic blood-parameter monitoring systems');
    expect(aboutText).toContain('chemistry and materials science');
  });

  it('displays all skills with their expertise levels', () => {
    render(<About />);
    
    // Check for skill categories
    expect(screen.getByText('Medical Device Engineering')).toBeInTheDocument();
    expect(screen.getByText('Project Management')).toBeInTheDocument();
    expect(screen.getByText('Design & Development')).toBeInTheDocument();
    expect(screen.getByText('Data & Analytics')).toBeInTheDocument();
    
    // Check for some specific skills
    expect(screen.getByText('Medical Device Development')).toBeInTheDocument();
    expect(screen.getByText('Accessibility & Inclusive Design')).toBeInTheDocument();
    expect(screen.getByText('AI/ML in Healthcare')).toBeInTheDocument();
    
    // Check for expertise levels in the legend
    const legendTexts = screen.getByTestId('skills-legend').textContent;
    expect(legendTexts).toContain('Novice');
    expect(legendTexts).toContain('Intermediate');
    expect(legendTexts).toContain('Advanced');
    expect(legendTexts).toContain('Expert');
    
    // Check for skill levels in the skill bars
    const expertBars = screen.getAllByText('Expert', { selector: '.pl-2' });
    const advancedBars = screen.getAllByText('Advanced', { selector: '.pl-2' });
    const intermediateBars = screen.getAllByText('Intermediate', { selector: '.pl-2' });
    const noviceBars = screen.getAllByText('Novice', { selector: '.pl-2' });
    
    expect(expertBars.length).toBeGreaterThanOrEqual(3);
    expect(advancedBars.length).toBeGreaterThanOrEqual(4);
    expect(intermediateBars.length).toBeGreaterThanOrEqual(1);
    expect(noviceBars.length).toBeGreaterThanOrEqual(1);
    
    // Check for gear icons
    const gearIcons = screen.getAllByTestId('gear-icon');
    expect(gearIcons.length).toBeGreaterThan(0);
  });

  it('applies custom className when provided', () => {
    const { container } = render(<About className="custom-class" />);
    
    // The custom class should be applied to the top-level div
    const topLevelDiv = container.firstChild as HTMLElement;
    expect(topLevelDiv).toHaveClass('custom-class');
  });
});
