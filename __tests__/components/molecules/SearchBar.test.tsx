import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SearchBar from '@/components/molecules/SearchBar';

// Mock child components
vi.mock('@/components/atoms', () => ({
  Input: ({ id, name, value, onChange, placeholder, className }: { id: string; name: string; value: string; onChange: (e: any) => void; placeholder?: string; className?: string }) => (
    <input
      data-testid="mock-input"
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
    />
  ),
  Button: ({ children, type, variant, size }: { children: React.ReactNode; type?: string; variant?: string; size?: string }) => (
    <button 
      data-testid="mock-button"
      type={type}
      data-variant={variant}
      data-size={size}
    >
      {children}
    </button>
  ),
}));

describe('SearchBar component', () => {
  it('renders with default props', () => {
    const handleSearch = vi.fn();
    render(<SearchBar onSearch={handleSearch} />);
    
    const input = screen.getByTestId('mock-input');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', 'Search...');
    
    const button = screen.getByTestId('mock-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Search');
  });
  
  it('renders with custom placeholder and button text', () => {
    const handleSearch = vi.fn();
    render(
      <SearchBar 
        onSearch={handleSearch} 
        placeholder="Custom placeholder" 
        buttonText="Go"
      />
    );
    
    const input = screen.getByTestId('mock-input');
    expect(input).toHaveAttribute('placeholder', 'Custom placeholder');
    
    const button = screen.getByTestId('mock-button');
    expect(button).toHaveTextContent('Go');
  });
  
  it('applies custom className', () => {
    const handleSearch = vi.fn();
    render(<SearchBar onSearch={handleSearch} className="test-class" />);
    
    const form = screen.getByTestId('mock-input').closest('form');
    expect(form).toHaveClass('test-class');
  });
  
  it('updates input value when typing', () => {
    const handleSearch = vi.fn();
    render(<SearchBar onSearch={handleSearch} />);
    
    const input = screen.getByTestId('mock-input');
    
    // Simulate typing
    fireEvent.change(input, { target: { value: 'test query' } });
    
    // We can't directly check the state value since it's internal,
    // but we can test the behavior when submitting
    const form = input.closest('form');
    fireEvent.submit(form!);
    
    expect(handleSearch).toHaveBeenCalledWith('test query');
  });
  
  it('calls onSearch when form is submitted', () => {
    const handleSearch = vi.fn();
    render(<SearchBar onSearch={handleSearch} />);
    
    const input = screen.getByTestId('mock-input');
    fireEvent.change(input, { target: { value: 'test query' } });
    
    const form = input.closest('form');
    fireEvent.submit(form!);
    
    expect(handleSearch).toHaveBeenCalledTimes(1);
    expect(handleSearch).toHaveBeenCalledWith('test query');
  });
  
  it('does not call onSearch when query is empty', () => {
    const handleSearch = vi.fn();
    render(<SearchBar onSearch={handleSearch} />);
    
    // Don't set any value (empty string)
    const form = screen.getByTestId('mock-input').closest('form');
    fireEvent.submit(form!);
    
    expect(handleSearch).not.toHaveBeenCalled();
  });
  
  it('passes correct props to Button component', () => {
    const handleSearch = vi.fn();
    render(<SearchBar onSearch={handleSearch} />);
    
    const button = screen.getByTestId('mock-button');
    expect(button).toHaveAttribute('type', 'submit');
    expect(button).toHaveAttribute('data-variant', 'primary');
    expect(button).toHaveAttribute('data-size', 'md');
  });
});
