import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import {
  GitHubIcon,
  LinkedInIcon,
  EmailIcon,
  CodeIcon,
  MenuIcon,
  IconProps
} from '@/components/atoms/icons';

// Helper function to test core icon functionality
function testIconComponent(IconComponent: React.FC<IconProps>, name: string) {
  describe(`${name} component`, () => {
    it('renders with default props', () => {
      render(<IconComponent />);
      
      const svg = document.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('width', '20');
      expect(svg).toHaveAttribute('height', '20');
      expect(svg).toHaveAttribute('stroke', 'currentColor');
    });
    
    it('applies custom size', () => {
      render(<IconComponent size={32} />);
      
      const svg = document.querySelector('svg');
      expect(svg).toHaveAttribute('width', '32');
      expect(svg).toHaveAttribute('height', '32');
    });
    
    it('applies custom color', () => {
      render(<IconComponent color="#ff0000" />);
      
      const svg = document.querySelector('svg');
      expect(svg).toHaveAttribute('stroke', '#ff0000');
    });
    
    it('applies custom className', () => {
      render(<IconComponent className="test-class" />);
      
      const svg = document.querySelector('svg');
      expect(svg).toHaveClass('test-class');
    });
  });
}

describe('Icon components', () => {
  // Test a representative sample of icons from different categories
  testIconComponent(GitHubIcon, 'GitHubIcon');
  testIconComponent(LinkedInIcon, 'LinkedInIcon');
  testIconComponent(EmailIcon, 'EmailIcon');
  testIconComponent(CodeIcon, 'CodeIcon');
  testIconComponent(MenuIcon, 'MenuIcon');
  
  // Additional specific tests if needed for unique icon behaviors
  it('applies the correct class based on icon type', () => {
    render(<GitHubIcon />);
    const githubSvg = document.querySelector('svg');
    expect(githubSvg).toHaveClass('feather-github');
    
    // Cleanup and render a different icon
    document.body.innerHTML = '';
    
    render(<EmailIcon />);
    const emailSvg = document.querySelector('svg');
    expect(emailSvg).toHaveClass('feather-mail');
  });
});
