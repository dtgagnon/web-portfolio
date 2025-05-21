import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SocialLinks from '@/components/molecules/SocialLinks';

// Mock dependencies
vi.mock('@/components/atoms', () => ({
  IconLink: ({ href, label, children }: { href: string; label: string; children: React.ReactNode }) => (
    <a href={href} aria-label={label} data-testid="mock-icon-link">
      {children}
    </a>
  ),
}));

vi.mock('@/components/atoms/icons', () => ({
  LinkedInIcon: ({ className }: { className?: string }) => (
    <svg data-testid="linkedin-icon" className={className} />
  ),
  GitHubIcon: ({ className }: { className?: string }) => (
    <svg data-testid="github-icon" className={className} />
  ),
  EmailIcon: ({ className }: { className?: string }) => ( // Added EmailIcon mock
    <svg data-testid="email-icon" className={className} />
  ),
}));

describe('SocialLinks component', () => {
  it('renders social links correctly with default email', () => {
    render(<SocialLinks />);
    
    const links = screen.getAllByTestId('mock-icon-link');
    expect(links).toHaveLength(3); // Email, LinkedIn, and GitHub
    
    // Order might vary depending on implementation, so check for specific hrefs
    const emailLink = links.find(link => link.getAttribute('href') === 'mailto:gagnon.derek@protonmail.com');
    const linkedInLink = links.find(link => link.getAttribute('href') === 'https://linkedin.com/in/derek-gagnon');
    const githubLink = links.find(link => link.getAttribute('href') === 'https://github.com/dtgagnon');

    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute('aria-label', 'Email Me');
    
    expect(linkedInLink).toBeInTheDocument();
    expect(linkedInLink).toHaveAttribute('aria-label', 'LinkedIn Profile');
    
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute('aria-label', 'GitHub Profile');
  });
  
  it('renders icons with correct testing ids', () => {
    render(<SocialLinks />);
    
    expect(screen.getByTestId('email-icon')).toBeInTheDocument(); // Added EmailIcon check
    expect(screen.getByTestId('linkedin-icon')).toBeInTheDocument();
    expect(screen.getByTestId('github-icon')).toBeInTheDocument();
  });
  
  it('applies horizontal layout by default', () => {
    const { container } = render(<SocialLinks />);
    
    const socialLinksContainer = container.firstChild;
    expect(socialLinksContainer).toHaveClass('flex', 'flex-row', 'space-x-4');
  });
  
  it('applies vertical layout when direction is column', () => {
    const { container } = render(<SocialLinks direction="column" />);
    
    const socialLinksContainer = container.firstChild;
    expect(socialLinksContainer).toHaveClass('flex', 'flex-col', 'space-y-4');
  });
  
  it('applies correct icon size class based on iconSize prop', () => {
    const sizes = [
      { prop: 'sm', class: 'w-4 h-4' },
      { prop: 'md', class: 'w-5 h-5' },
      { prop: 'lg', class: 'w-6 h-6' },
    ];
    
    sizes.forEach(({ prop, class: className }) => {
      const { unmount } = render(<SocialLinks iconSize={prop as 'sm' | 'md' | 'lg'} />);
      
      const emailIcon = screen.getByTestId('email-icon'); // Added EmailIcon
      const linkedInIcon = screen.getByTestId('linkedin-icon');
      const githubIcon = screen.getByTestId('github-icon');
      
      expect(emailIcon).toHaveClass(className); // Check EmailIcon class
      expect(linkedInIcon).toHaveClass(className);
      expect(githubIcon).toHaveClass(className);
      
      unmount();
    });
  });
  
  it('applies medium icon size by default', () => {
    render(<SocialLinks />);
    
    const linkedInIcon = screen.getByTestId('linkedin-icon');
    const githubIcon = screen.getByTestId('github-icon');
    
    expect(linkedInIcon).toHaveClass('w-5', 'h-5');
    expect(githubIcon).toHaveClass('w-5', 'h-5');
  });
  
  it('applies custom className to container', () => {
    const { container } = render(<SocialLinks className="test-class" />);
    
    const socialLinksContainer = container.firstChild;
    expect(socialLinksContainer).toHaveClass('test-class');
  });
});
