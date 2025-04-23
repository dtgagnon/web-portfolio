import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Card from '@/components/molecules/Card';

describe('Card component', () => {
  it('renders children correctly', () => {
    render(
      <Card>
        <p>Test Content</p>
      </Card>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
  
  it('renders with title when provided', () => {
    render(
      <Card title="Card Title">
        <p>Test Content</p>
      </Card>
    );
    
    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card Title').tagName).toBe('H3');
  });
  
  it('renders with footer when provided', () => {
    render(
      <Card footer={<button>Footer Button</button>}>
        <p>Test Content</p>
      </Card>
    );
    
    expect(screen.getByText('Footer Button')).toBeInTheDocument();
    
    // Footer should be in a separate container with special styling
    const footerContainer = screen.getByText('Footer Button').closest('div');
    expect(footerContainer).toHaveClass('bg-gray-50', 'dark:bg-gray-700');
  });
  
  it('applies custom className', () => {
    render(
      <Card className="test-class">
        <p>Test Content</p>
      </Card>
    );
    
    const card = screen.getByTestId('card');
    expect(card).toHaveClass('test-class');
  });
  
  it('handles onClick events', () => {
    const handleClick = vi.fn();
    
    render(
      <Card onClick={handleClick}>
        <p>Test Content</p>
      </Card>
    );
    
    const card = screen.getByTestId('card');
    fireEvent.click(card);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  it('applies hover styling when hoverable is true', () => {
    render(
      <Card hoverable={true}>
        <p>Test Content</p>
      </Card>
    );
    
    const card = screen.getByTestId('card');
    expect(card).toHaveClass(
      'transition-transform',
      'hover:-translate-y-1',
      'hover:shadow-lg',
      'cursor-pointer'
    );
  });
  
  it('does not apply hover styling when hoverable is false', () => {
    render(
      <Card hoverable={false}>
        <p>Test Content</p>
      </Card>
    );
    
    const card = screen.getByTestId('card');
    expect(card).not.toHaveClass(
      'transition-transform',
      'hover:-translate-y-1',
      'hover:shadow-lg',
      'cursor-pointer'
    );
  });
  
  it('has correct default styling', () => {
    render(
      <Card>
        <p>Test Content</p>
      </Card>
    );
    
    const card = screen.getByTestId('card');
    expect(card).toHaveClass(
      'bg-white',
      'dark:bg-gray-800',
      'rounded-lg',
      'shadow-md',
      'overflow-hidden'
    );
  });
});
