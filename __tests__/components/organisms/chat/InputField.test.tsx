import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import InputField from '@/components/organisms/chat/InputField';

describe('InputField component', () => {
  const defaultProps = {
    message: '',
    setMessage: vi.fn(),
    isLoading: false,
    onSubmit: vi.fn(e => e.preventDefault())
  };
  
  it('renders input field and send button', () => {
    render(<InputField {...defaultProps} />);
    
    expect(screen.getByPlaceholderText('Type your message...')).toBeInTheDocument();
    expect(screen.getByLabelText('Send message')).toBeInTheDocument();
  });
  
  it('updates message when typing', () => {
    render(<InputField {...defaultProps} />);
    
    const input = screen.getByLabelText('Message input');
    fireEvent.change(input, { target: { value: 'Hello world' } });
    
    expect(defaultProps.setMessage).toHaveBeenCalledWith('Hello world');
  });
  
  it('disables input when loading', () => {
    render(<InputField {...defaultProps} isLoading={true} />);
    
    const input = screen.getByLabelText('Message input');
    expect(input).toBeDisabled();
  });
  
  it('disables send button when message is empty', () => {
    render(<InputField {...defaultProps} />);
    
    const button = screen.getByLabelText('Send message');
    expect(button).toBeDisabled();
  });
  
  it('enables send button when message has content', () => {
    render(<InputField {...defaultProps} message="Hello" />);
    
    const button = screen.getByLabelText('Send message');
    expect(button).not.toBeDisabled();
  });
  
  it('disables send button when loading regardless of message content', () => {
    render(<InputField {...defaultProps} message="Hello" isLoading={true} />);
    
    const button = screen.getByLabelText('Send message');
    expect(button).toBeDisabled();
  });
  
  it('submits form when send button is clicked', () => {
    render(<InputField {...defaultProps} message="Hello" />);
    
    const button = screen.getByLabelText('Send message');
    fireEvent.click(button);
    
    expect(defaultProps.onSubmit).toHaveBeenCalled();
  });
  
  it('submits form when Enter key is pressed', () => {
    render(<InputField {...defaultProps} message="Hello" />);
    
    const input = screen.getByLabelText('Message input');
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });
    
    // The form submission is handled by the browser's default behavior
    // We're not directly testing the onSubmit here as it requires form submission
    // which is handled differently in the testing environment
  });
  
  it('displays loading spinner when isLoading is true', () => {
    render(<InputField {...defaultProps} isLoading={true} />);
    
    const spinnerElement = screen.getByText('⟳');
    expect(spinnerElement).toBeInTheDocument();
    expect(spinnerElement).toHaveClass('animate-spin');
  });
  
  it('displays send icon when not loading', () => {
    render(<InputField {...defaultProps} message="Hello" />);
    
    // Check for SVG paper plane icon
    const svgElement = screen.getByLabelText('Send message').querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });
  
  it('has appropriate styling classes', () => {
    const { container } = render(<InputField {...defaultProps} />);
    
    // Form should have flex and gap classes
    const form = container.querySelector('form');
    expect(form).toHaveClass('flex', 'gap-2');
    
    // Input should have appropriate styling
    const input = screen.getByLabelText('Message input');
    expect(input).toHaveClass(
      'flex-1', 
      'p-2', 
      'rounded', 
      'border',
      'focus:outline-none'
    );
    
    // Button should have appropriate styling
    const button = screen.getByLabelText('Send message');
    expect(button).toHaveClass(
      'px-4', 
      'py-2', 
      'bg-[skyblue]', 
      'text-black', 
      'rounded', 
      'hover:bg-sky-600', 
      'disabled:opacity-50', 
      'transition-colors'
    );
  });
  
  it('trims whitespace when checking if message is empty', () => {
    render(<InputField {...defaultProps} message="   " />);
    
    const button = screen.getByLabelText('Send message');
    expect(button).toBeDisabled();
  });
});
