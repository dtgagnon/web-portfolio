import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ContactInfo from '@/components/molecules/ContactInfo';

describe('ContactInfo component', () => {
  const defaultProps = {
    name: 'Derek Gagnon',
    email: 'gagnon.derek@protonmail.com'
  };

  it('renders name and email correctly', () => {
    render(<ContactInfo {...defaultProps} />);
    
    expect(screen.getByText('Derek Gagnon')).toBeInTheDocument();
    expect(screen.getByText('gagnon.derek@protonmail.com')).toBeInTheDocument();
  });
  
  it('renders name in a heading element', () => {
    render(<ContactInfo {...defaultProps} />);
    
    const nameHeading = screen.getByText('Derek Gagnon');
    expect(nameHeading.tagName).toBe('H2');
    expect(nameHeading).toHaveClass('text-2xl', 'font-semibold');
  });
  
  it('creates a mailto link for the email', () => {
    render(<ContactInfo {...defaultProps} />);
    
    const emailLink = screen.getByText('gagnon.derek@protonmail.com');
    expect(emailLink.tagName).toBe('A');
    expect(emailLink).toHaveAttribute('href', 'mailto:gagnon.derek@protonmail.com');
  });
  
  it('applies accessibility attributes to the email link', () => {
    render(<ContactInfo {...defaultProps} />);
    
    const emailLink = screen.getByText('gagnon.derek@protonmail.com');
    expect(emailLink).toHaveAttribute('aria-label', 'Send email to Derek Gagnon');
  });
  
  it('shows label when showLabel is true', () => {
    render(<ContactInfo {...defaultProps} showLabel={true} />);
    
    expect(screen.getByText('Email:')).toBeInTheDocument();
  });
  
  it('does not show label when showLabel is false', () => {
    render(<ContactInfo {...defaultProps} showLabel={false} />);
    
    expect(screen.queryByText('Email:')).not.toBeInTheDocument();
  });
  
  it('applies custom className to container', () => {
    render(<ContactInfo {...defaultProps} className="test-class" />);
    
    const container = screen.getByText('Derek Gagnon').closest('div');
    expect(container).toHaveClass('test-class');
  });
  
  it('applies hover styling to email link', () => {
    render(<ContactInfo {...defaultProps} />);
    
    const emailLink = screen.getByText('gagnon.derek@protonmail.com');
    expect(emailLink).toHaveClass('hover:border-b', 'border-dashed');
  });
});
