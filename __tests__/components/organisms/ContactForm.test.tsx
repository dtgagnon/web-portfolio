import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ContactForm from '@/components/organisms/ContactForm';

// No need to mock Input and Button components anymore, we'll use the real ones

describe('ContactForm component', () => {
  const mockOnSubmit = vi.fn();
  
  beforeEach(() => {
    mockOnSubmit.mockReset();
    vi.clearAllMocks();
  });
  
  it('renders form fields correctly', () => {
    render(<ContactForm />);
    
    // Check form fields by their labels and placeholders
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(screen.getByText(/send message/i)).toBeInTheDocument();
  });
  
  it('shows validation errors for empty fields on submit', async () => {
    render(<ContactForm />);
    
    // Submit empty form
    fireEvent.submit(screen.getByRole('form'));
    
    // Check for validation errors
    await waitFor(() => {
      // The real component should show validation messages
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/message is required/i)).toBeInTheDocument();
    });
  });
  
  it('shows validation error for invalid email', async () => {
    render(<ContactForm />);
    
    // Fill name and message, but with invalid email
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'invalid-email' } });
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: 'Test message' } });
    
    // Submit form
    fireEvent.submit(screen.getByRole('form'));
    
    // Check that the email input has an invalid state after validation
    await waitFor(() => {
      const emailInput = screen.getByLabelText(/email/i);
      expect(emailInput).toHaveAttribute('aria-invalid', 'true');
      
      // Check for any validation error text related to email
      const emailContainer = emailInput.closest('div');
      const errorTexts = Array.from(emailContainer?.querySelectorAll('p') || []);
      expect(errorTexts.length).toBeGreaterThan(0);
    });
  });
  
  it('clears error when field is edited', async () => {
    const { container } = render(<ContactForm />);
    
    // Submit empty form to trigger errors
    fireEvent.submit(screen.getByRole('form'));
    
    // Edit the message field (which we can directly test)
    const messageField = screen.getByLabelText(/message/i);
    fireEvent.change(messageField, { target: { value: 'Test message' } });
    
    // Error for message should be cleared
    await waitFor(() => {
      expect(screen.queryByText(/message is required/i)).not.toBeInTheDocument();
    });
  });
  
  it('calls onSubmit prop with form data when form is valid', async () => {
    render(<ContactForm onSubmit={mockOnSubmit} />);
    
    // Fill the form
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: 'Test message' } });
    
    // Submit form
    fireEvent.click(screen.getByText(/send message/i));
    
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
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: 'Test message' } });
    
    // Submit form
    fireEvent.click(screen.getByText(/send message/i));
    
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
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: 'Test message' } });
    
    // Submit form
    const submitButton = screen.getByText(/send message/i);
    fireEvent.click(submitButton);
    
    // Check button shows loading text
    expect(screen.getByText(/sending/i)).toBeInTheDocument();
    
    // Wait for submission to complete
    await waitFor(() => {
      expect(screen.getByText(/send message/i)).toBeInTheDocument();
    });
  });
  
  it('shows error message when submission fails', async () => {
    render(<ContactForm onSubmit={mockOnSubmit} />);
    
    // Mock onSubmit to reject
    mockOnSubmit.mockRejectedValue(new Error('Submission failed'));
    
    // Fill the form
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: 'Test message' } });
    
    // Submit form
    fireEvent.click(screen.getByText(/send message/i));
    
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
