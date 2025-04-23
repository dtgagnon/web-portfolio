import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import IconLink from '@/components/atoms/IconLink';

describe('IconLink component', () => {
  it('renders with required props', () => {
    render(
      <IconLink href="https://example.com" label="Example Link">
        <svg data-testid="mock-icon" />
      </IconLink>
    );
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('aria-label', 'Example Link');
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
  });
  
  it('applies className when provided', () => {
    render(
      <IconLink 
        href="https://example.com" 
        label="Example Link" 
        className="test-class"
      >
        <svg data-testid="mock-icon" />
      </IconLink>
    );
    
    const link = screen.getByRole('link');
    expect(link).toHaveClass('test-class');
  });
  
  it('has target and rel attributes when external=true (default)', () => {
    render(
      <IconLink href="https://example.com" label="Example Link">
        <svg data-testid="mock-icon" />
      </IconLink>
    );
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
  
  it('does not have target and rel attributes when external=false', () => {
    render(
      <IconLink 
        href="https://example.com" 
        label="Example Link" 
        external={false}
      >
        <svg data-testid="mock-icon" />
      </IconLink>
    );
    
    const link = screen.getByRole('link');
    expect(link).not.toHaveAttribute('target');
    expect(link).not.toHaveAttribute('rel');
  });
  
  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn();
    
    render(
      <IconLink 
        href="https://example.com" 
        label="Example Link" 
        onClick={handleClick}
      >
        <svg data-testid="mock-icon" />
      </IconLink>
    );
    
    const link = screen.getByRole('link');
    fireEvent.click(link);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  it('applies default styling classes for hover states', () => {
    render(
      <IconLink href="https://example.com" label="Example Link">
        <svg data-testid="mock-icon" />
      </IconLink>
    );
    
    const link = screen.getByRole('link');
    expect(link).toHaveClass(
      'inline-flex', 
      'items-center', 
      'justify-center', 
      'text-current',
      'hover:text-gray-700',
      'dark:hover:text-gray-300',
      'transition-colors'
    );
  });
  
  it('renders children correctly', () => {
    render(
      <IconLink href="https://example.com" label="Example Link">
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
      </IconLink>
    );
    
    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
  });
});
