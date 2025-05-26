import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MessageBubble } from '@/components/organisms/chat/MessageBubble';

// Mock the extractMessageContent function
vi.mock('@/lib/api/llm/llmMsgExtractor', () => ({
  extractMessageContent: (content: any) => 'Extracted content'
}));

describe('MessageBubble component', () => {
  it('renders user message with correct styling', () => {
    const userMessage = {
      id: '1',
      content: 'Hello there!',
      role: 'user' as 'user',
      created_at: 1620000000
    };
    
    const { container } = render(<MessageBubble message={userMessage} />);
    
    expect(screen.getByText('Hello there!')).toBeInTheDocument();
    const messageBubble = container.querySelector('div');
    expect(messageBubble).toHaveClass('ml-auto', 'bg-white', 'dark:bg-gray-800', 'text-black', 'dark:text-white');
  });
  
  it('renders assistant message with correct styling', () => {
    const assistantMessage = {
      id: '2',
      content: 'I can help with that.',
      role: 'assistant' as 'assistant',
      created_at: 1620000000
    };
    
    const { container } = render(<MessageBubble message={assistantMessage} />);
    
    expect(screen.getByText('I can help with that.')).toBeInTheDocument();
    const messageBubble = container.querySelector('div');
    expect(messageBubble).toHaveClass('mr-auto', 'bg-blue-100', 'text-black', 'dark:bg-blue-900', 'dark:text-blue-100');
  });
  
  it('renders system message with correct styling', () => {
    const systemMessage = {
      id: '3',
      content: 'Connection error occurred.',
      role: 'system' as 'system',
      created_at: 1620000000
    };
    
    const { container } = render(<MessageBubble message={systemMessage} />);
    
    expect(screen.getByText('Connection error occurred.')).toBeInTheDocument();
    const messageBubble = container.querySelector('div');
    expect(messageBubble).toHaveClass('mx-auto', 'bg-gray-300', 'dark:bg-gray-700');
    expect(messageBubble).toHaveClass('italic', 'text-sm');
  });
  
  it('displays formatted time for user and assistant messages', () => {
    // Mock Date.prototype.toLocaleTimeString
    const originalToLocaleTimeString = Date.prototype.toLocaleTimeString;
    Date.prototype.toLocaleTimeString = vi.fn().mockReturnValue('3:45 PM');
    
    const userMessage = {
      id: '1',
      content: 'Hello there!',
      role: 'user' as 'user',
      created_at: 1620000000
    };
    
    render(<MessageBubble message={userMessage} />);
    expect(screen.getByText('3:45 PM')).toBeInTheDocument();
    
    // Restore original function
    Date.prototype.toLocaleTimeString = originalToLocaleTimeString;
  });
  
  it('does not display time for system messages', () => {
    // Mock Date.prototype.toLocaleTimeString
    const originalToLocaleTimeString = Date.prototype.toLocaleTimeString;
    Date.prototype.toLocaleTimeString = vi.fn().mockReturnValue('3:45 PM');
    
    const systemMessage = {
      id: '3',
      content: 'Connection error occurred.',
      role: 'system' as 'system',
      created_at: 1620000000
    };
    
    render(<MessageBubble message={systemMessage} />);
    expect(screen.queryByText('3:45 PM')).not.toBeInTheDocument();
    
    // Restore original function
    Date.prototype.toLocaleTimeString = originalToLocaleTimeString;
  });
  
  it('handles complex message content format', () => {
    const complexMessage = {
      id: '4',
      content: [
        {
          type: 'text',
          text: {
            value: 'Complex message structure',
            annotations: []
          }
        }
      ],
      role: 'assistant' as 'assistant',
      created_at: 1620000000
    };
    
    render(<MessageBubble message={complexMessage} />);
    expect(screen.getByText('Extracted content')).toBeInTheDocument();
  });
  
  it('has appropriate styling classes for bubbles', () => {
    const userMessage = {
      id: '1',
      content: 'Hello there!',
      role: 'user' as 'user',
      created_at: 1620000000
    };
    
    const { container } = render(<MessageBubble message={userMessage} />);
    
    const messageBubble = container.querySelector('div');
    expect(messageBubble).toHaveClass('p-3', 'my-2', 'rounded-lg', 'max-w-[85%]');
    
    // Text content should have whitespace and word breaking styles
    const textElement = container.querySelector('p');
    expect(textElement).toHaveClass('whitespace-pre-wrap', 'break-words');
    
    // Time element should have appropriate styles
    const timeElement = container.querySelector('.text-xs');
    expect(timeElement).toHaveClass('mt-1', 'text-gray-600', 'dark:text-gray-300', 'text-right');
  });
});
