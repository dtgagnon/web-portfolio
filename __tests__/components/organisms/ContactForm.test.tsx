import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ContactForm from '@/components/organisms/ContactForm';

// Mock Input component
vi.mock('@/components/molecules', () => ({
  Input: ({ 
    id, 
    name, 
    value, 
    onChange, 
    label, 
    required, 
    placeholder, 
    error 
  }: any) => (
    <div data-testid={`input-${name}`}>
      {label && (
        <label htmlFor={id}>
          {label}
          {required && <span>*</span>}
        </label>
      )}
      <input
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        data-testid={`${name}-input`}
      />
      {error && <p data-testid={`${name}-error`}>{error}</p>}
    </div>
  ),
  Button: ({ 
    children, 
    type, 
    disabled, 
    variant,
    size,
    className,
    onClick
  }: any) => (
    <button 
      type={type} 
      disabled={disabled}
      onClick={onClick}
      data-variant={variant}
      data-size={size}
      className={className}
      data-testid="submit-button"
    >
      {children}
    </button>
  ),
}));

describe('ContactForm component', () => {
  const mockOnSubmit = vi.fn();
  
  beforeEach(() => {
    mockOnSubmit.mockReset();
    vi.clearAllMocks();
  });
  
  it('renders form fields correctly', () => {
    render(<ContactForm />);
    
    // Check form fields
    expect(screen.getByTestId('name-input')).toBeInTheDocument();
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
  });
  
  it('shows validation errors for empty fields on submit', async () => {
    render(<ContactForm />);
    
    // Submit empty form
    fireEvent.click(screen.getByTestId('submit-button'));
    
    // Check for validation errors
    await waitFor(() => {
      expect(screen.getByTestId('name-error')).toBeInTheDocument();
      expect(screen.getByTestId('email-error')).toBeInTheDocument();
      expect(screen.getByText(/message is required/i)).toBeInTheDocument();
    });
  });
  
  it('shows validation error for invalid email', async () => {
    render(<ContactForm />);
    
    // Fill name and message, but with invalid email
    fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'invalid-email' } });
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: 'Test message' } });
    
    // Submit form
    fireEvent.click(screen.getByTestId('submit-button'));
    
    // Check for email validation error
    await waitFor(() => {
      expect(screen.getByTestId('email-error')).toBeInTheDocument();
      expect(screen.getByTestId('email-error')).toHaveTextContent(/email is invalid/i);
    });
  });
  
  it('clears error when field is edited', async () => {
    render(<ContactForm />);
    
    // Submit empty form to trigger errors
    fireEvent.click(screen.getByTestId('submit-button'));
    
    // Check that error exists
    await waitFor(() => {
      expect(screen.getByTestId('name-error')).toBeInTheDocument();
    });
    
    // Edit the field
    fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'John Doe' } });
    
    // Error should be cleared
    await waitFor(() => {
      expect(screen.queryByTestId('name-error')).not.toBeInTheDocument();
    });
  });
  
  it('calls onSubmit prop with form data when form is valid', async () => {
    render(<ContactForm onSubmit={mockOnSubmit} />);
    
    // Fill the form
    fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: 'Test message' } });
    
    // Submit form
    fireEvent.click(screen.getByTestId('submit-button'));
    
    // Check onSubmit was called with correct data
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Test message'
      });
    });
  });
  
  it('shows success message after successful submission', async () => {
    render(<ContactForm onSubmit={mockOnSubmit} />);
    
    // Fill the form
    fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: 'Test message' } });
    
    // Submit form
    fireEvent.click(screen.getByTestId('submit-button'));
    
    // Check success message
    await waitFor(() => {
      expect(screen.getByText(/thank you for your message/i)).toBeInTheDocument();
    });
  });
  
  it('disables submit button while submitting', async () => {
    render(<ContactForm onSubmit={mockOnSubmit} />);
    
    // Mock onSubmit to delay resolution
    mockOnSubmit.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    // Fill the form
    fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: 'Test message' } });
    
    // Submit form
    fireEvent.click(screen.getByTestId('submit-button'));
    
    // Check button is disabled and shows loading text
    expect(screen.getByTestId('submit-button')).toBeDisabled();
    expect(screen.getByTestId('submit-button')).toHaveTextContent(/sending/i);
    
    // Wait for submission to complete
    await waitFor(() => {
      expect(screen.getByTestId('submit-button')).not.toBeDisabled();
      expect(screen.getByTestId('submit-button')).toHaveTextContent(/send message/i);
    });
  });
  
  it('shows error message when submission fails', async () => {
    render(<ContactForm onSubmit={mockOnSubmit} />);
    
    // Mock onSubmit to reject
    mockOnSubmit.mockRejectedValue(new Error('Submission failed'));
    
    // Fill the form
    fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: 'Test message' } });
    
    // Submit form
    fireEvent.click(screen.getByTestId('submit-button'));
    
    // Check error message
    await waitFor(() => {
      expect(screen.getByText(/there was an error sending your message/i)).toBeInTheDocument();
    });
  });
  
  it('applies custom className', () => {
    const { container } = render(<ContactForm className="test-class" />);
    
    const form = container.querySelector('form');
    expect(form).toHaveClass('test-class');
  });
});
