import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Input from '@/components/atoms/Input';

describe('Input component', () => {
  // Default props for most tests
  const defaultProps = {
    id: 'test-input',
    name: 'test-input',
    value: '',
    onChange: vi.fn(),
  };

  it('renders with required props', () => {
    render(<Input {...defaultProps} />);
    
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('id', 'test-input');
    expect(input).toHaveAttribute('name', 'test-input');
    expect(input).toHaveValue('');
  });
  
  it('renders label when provided', () => {
    render(<Input {...defaultProps} label="Test Label" />);
    
    const label = screen.getByText('Test Label');
    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute('for', 'test-input');
  });
  
  it('indicates required fields', () => {
    render(<Input {...defaultProps} label="Required Field" required={true} />);
    
    const asterisk = screen.getByText('*');
    expect(asterisk).toBeInTheDocument();
    expect(asterisk).toHaveClass('text-red-500');
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('required');
  });
  
  it('shows placeholder text', () => {
    render(<Input {...defaultProps} placeholder="Enter text here" />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('placeholder', 'Enter text here');
  });
  
  it('handles value changes', () => {
    const handleChange = vi.fn();
    render(<Input {...defaultProps} onChange={handleChange} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'new value' } });
    
    expect(handleChange).toHaveBeenCalledTimes(1);
  });
  
  it('can be disabled', () => {
    render(<Input {...defaultProps} disabled={true} />);
    
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
    expect(input).toHaveClass('opacity-50', 'cursor-not-allowed');
  });
  
  it('shows error message when error is provided', () => {
    render(<Input {...defaultProps} error="This field is required" />);
    
    // Error message should be shown
    const errorMessage = screen.getByText('This field is required');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass('text-red-500');
    
    // Input should have error styling
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('border-red-500');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });
  
  it('applies custom className', () => {
    render(<Input {...defaultProps} className="custom-class" />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('custom-class');
  });
  
  it('supports different input types', () => {
    const { rerender } = render(<Input {...defaultProps} type="email" />);
    
    let input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('type', 'email');
    
    rerender(<Input {...defaultProps} type="password" />);
    // Password inputs aren't exposed by getByRole('textbox'), need to query by type
    input = screen.getByDisplayValue(''); // Get by empty value since we're using defaultProps
    expect(input).toHaveAttribute('type', 'password');
    
    rerender(<Input {...defaultProps} type="number" />);
    input = screen.getByRole('spinbutton');
    expect(input).toHaveAttribute('type', 'number');
  });
  
  it('adds autocomplete attribute when provided', () => {
    render(<Input {...defaultProps} autoComplete="email" />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('autocomplete', 'email');
  });
});
