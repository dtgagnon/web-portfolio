import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ChatCard from '@/components/organisms/chat/ChatCard';

// Mock the hooks and child components
vi.mock('@/lib/helpers/chatCooldown', () => ({
  useChatCooldown: () => ({
    startCooldown: vi.fn(),
    resetCooldown: vi.fn(),
    incrementErrorCount: vi.fn(),
    isCooldownActive: vi.fn().mockReturnValue(false),
    getRemainingCooldown: vi.fn().mockReturnValue(30),
    getCooldownMessage: vi.fn().mockReturnValue('Please wait before sending another message')
  })
}));

vi.mock('@/lib/helpers/useCursorPosition', () => ({
  useCursorPosition: () => ({ x: 100, y: 100 })
}));

vi.mock('@/lib/api/llm/useChatHistory', () => ({
  __esModule: true,
  default: () => ({
    messages: [],
    setMessages: vi.fn(),
    sessionId: 'test-session-id',
    isLoading: false,
    setIsLoading: vi.fn(),
    fetchChatHistory: vi.fn(),
    sendMessage: vi.fn().mockResolvedValue(true)
  })
}));

vi.mock('@/components/organisms/chat/MessageBubble', () => ({
  MessageBubble: ({ message }: any) => (
    <div data-testid="mock-message-bubble" data-role={message.role}>
      {typeof message.content === 'string' ? message.content : 'Complex message'}
    </div>
  )
}));

vi.mock('@/components/organisms/chat/InputField', () => ({
  __esModule: true,
  default: ({ message, setMessage, isLoading, onSubmit }: any) => (
    <form data-testid="mock-input-field" onSubmit={onSubmit}>
      <input 
        value={message} 
        onChange={(e) => setMessage(e.target.value)} 
        data-is-loading={isLoading}
      />
      <button type="submit">Send</button>
    </form>
  )
}));

// Mock the rect and scrollIntoView functions
Element.prototype.getBoundingClientRect = vi.fn().mockReturnValue({
  bottom: 500,
  height: 300,
  left: 300,
  right: 500,
  top: 200,
  width: 200,
  x: 300,
  y: 200,
  toJSON: vi.fn()
});

Element.prototype.scrollIntoView = vi.fn();

describe('ChatCard component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('renders with chat header', () => {
    render(<ChatCard />);
    
    expect(screen.getByText('Chat with Me')).toBeInTheDocument();
  });
  
  it('shows instructions when no messages are present', () => {
    render(<ChatCard />);
    
    expect(screen.getByText('Ask me anything about my work!')).toBeInTheDocument();
    expect(screen.getByText(/ask me about my ux design work/i)).toBeInTheDocument();
  });
  
  it('toggles open state when chat header is clicked', () => {
    const { container } = render(<ChatCard />);
    
    // Initial state: peek from bottom
    expect(container.querySelector('div')).toHaveClass('translate-y-[calc(100%-2.5rem)]');
    
    // Click to open
    fireEvent.click(screen.getByText('Chat with Me'));
    expect(container.querySelector('div')).toHaveClass('translate-y-0');
    
    // Click to close
    fireEvent.click(screen.getByText('Chat with Me'));
    expect(container.querySelector('div')).toHaveClass('translate-y-[calc(100%-2.5rem)]');
  });
  
  it('renders input field with correct props', () => {
    render(<ChatCard />);
    
    const inputField = screen.getByTestId('mock-input-field');
    expect(inputField).toBeInTheDocument();
    expect(inputField.querySelector('input')).toHaveAttribute('data-is-loading', 'false');
  });
  
  it('handles message submission', async () => {
    const useChatHistoryMock = require('@/lib/api/llm/useChatHistory').default;
    useChatHistoryMock().sendMessage.mockResolvedValueOnce(true);
    
    render(<ChatCard />);
    
    const inputField = screen.getByTestId('mock-input-field');
    const input = inputField.querySelector('input');
    const submitButton = screen.getByText('Send');
    
    // Type a message
    fireEvent.change(input as HTMLInputElement, { target: { value: 'Hello world' } });
    
    // Submit the form
    fireEvent.click(submitButton);
    
    // Check if sendMessage was called with the right message
    await vi.waitFor(() => {
      expect(useChatHistoryMock().sendMessage).toHaveBeenCalledWith('Hello world');
    });
  });
  
  it('renders messages when they exist', () => {
    // Mock messages array
    const useChatHistoryMock = require('@/lib/api/llm/useChatHistory').default;
    useChatHistoryMock.mockReturnValueOnce({
      messages: [
        { id: '1', content: 'Hello', role: 'user', created_at: 1620000000 },
        { id: '2', content: 'Hi there!', role: 'assistant', created_at: 1620000100 }
      ],
      setMessages: vi.fn(),
      sessionId: 'test-session-id',
      isLoading: false,
      setIsLoading: vi.fn(),
      fetchChatHistory: vi.fn(),
      sendMessage: vi.fn().mockResolvedValue(true)
    });
    
    render(<ChatCard />);
    
    const messageBubbles = screen.getAllByTestId('mock-message-bubble');
    expect(messageBubbles).toHaveLength(2);
    expect(messageBubbles[0]).toHaveAttribute('data-role', 'user');
    expect(messageBubbles[1]).toHaveAttribute('data-role', 'assistant');
  });
  
  it('displays cooldown message when cooldown is active', () => {
    // Mock cooldown as active
    const useChatCooldownMock = require('@/lib/helpers/chatCooldown').useChatCooldown;
    useChatCooldownMock.mockReturnValueOnce({
      startCooldown: vi.fn(),
      resetCooldown: vi.fn(),
      incrementErrorCount: vi.fn(),
      isCooldownActive: vi.fn().mockReturnValue(true),
      getRemainingCooldown: vi.fn().mockReturnValue(30),
      getCooldownMessage: vi.fn().mockReturnValue('Please wait 30s before sending another message')
    });
    
    render(<ChatCard />);
    
    expect(screen.getByText('Please wait 30s before sending another message')).toBeInTheDocument();
    expect(screen.getByText('Please wait 30s before sending another message')).toHaveClass('text-red-500');
  });
  
  it('has correct styling for peeking behavior', () => {
    const { container } = render(<ChatCard />);
    
    const chatCard = container.querySelector('div');
    expect(chatCard).toHaveClass(
      'fixed',
      'bottom-0',
      'origin-bottom',
      'rounded-t-md',
      'transition-transform',
      'translate-y-[calc(100%-2.5rem)]'
    );
    
    // Chat header
    const chatHeader = screen.getByText('Chat with Me').closest('div');
    expect(chatHeader).toHaveClass(
      'p-2',
      'cursor-pointer',
      'rounded-t-lg',
      'bg-[#7cbddb]',
      'dark:bg-pink'
    );
    
    // Messages container
    const messagesContainer = container.querySelectorAll('div')[2]; // Third div should be messages container
    expect(messagesContainer).toHaveClass(
      'p-3',
      'max-h-96',
      'overflow-y-auto',
      'bg-white',
      'dark:bg-black'
    );
    
    // Input area
    const inputArea = container.querySelectorAll('div')[3]; // Fourth div should be input area
    expect(inputArea).toHaveClass(
      'p-3',
      'border-t',
      'bg-amber-50',
      'dark:bg-gray-900'
    );
  });
});
