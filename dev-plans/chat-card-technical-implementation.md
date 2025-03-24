# Enhanced Chat Card Technical Implementation

This document outlines the specific technical implementation details for the enhanced chat card component that will be added to the portfolio site.

## Component Structure

The `EnhancedChatCard.tsx` component will have the following structure:

```typescript
import React, { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
}

const EnhancedChatCard: React.FC = () => {
  // State variables
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I can answer questions about my experience in medical device engineering. What would you like to know?',
      isUser: false,
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Component logic and handlers
  // ...

  return (
    <div 
      className={chatCardClasses}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Component JSX */}
    </div>
  );
};

export default EnhancedChatCard;
```

## Tailwind CSS Classes and Animation States

### Base Chat Card

```typescript
// Composing class names based on state
const chatCardClasses = `
  fixed bottom-0 left-0 right-0 mx-auto w-11/12 md:w-4/5 lg:w-3/4 max-w-4xl
  bg-white rounded-t-2xl shadow-xl z-50 overflow-hidden
  transform transition-all duration-300 ease-in-out
  ${isExpanded 
    ? 'h-[80vh] translate-y-0' 
    : isHovered 
      ? 'translate-y-[20%]' 
      : 'translate-y-[85%]'
  }
`;
```

### Chat Header

```typescript
const headerClasses = `
  p-4 bg-pink text-white rounded-t-2xl cursor-pointer
  flex items-center justify-between
`;
```

### Chat History Container

```typescript
const historyContainerClasses = `
  flex-grow overflow-y-auto p-4
  ${isExpanded ? 'block' : 'hidden'}
`;
```

### Chat Input Container

```typescript
const inputContainerClasses = `
  border-t border-gray-200 p-4
  ${isExpanded ? 'mt-auto' : ''}
`;
```

### Message Bubbles

```typescript
const getUserMessageClasses = () => `
  ml-auto bg-pink text-white p-3 rounded-lg rounded-br-none
  max-w-[80%] mb-3
`;

const getBotMessageClasses = () => `
  mr-auto bg-cream text-dark p-3 rounded-lg rounded-bl-none
  max-w-[80%] mb-3
`;
```

## State Management Logic

### Hover State

```typescript
const handleMouseEnter = () => {
  if (!isExpanded) {
    setIsHovered(true);
  }
};

const handleMouseLeave = () => {
  if (!isExpanded) {
    setIsHovered(false);
  }
};
```

### Expansion Logic

```typescript
const handleSendMessage = (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!inputValue.trim()) return;
  
  // Create new message
  const newMessage: Message = {
    id: Date.now().toString(),
    text: inputValue,
    isUser: true,
  };
  
  // Add user message to chat
  setMessages(prevMessages => [...prevMessages, newMessage]);
  setInputValue('');
  
  // Expand the card if it's the first user message
  if (messages.length === 1) {
    setIsExpanded(true);
  }
  
  // Simulate bot response (in real implementation, call API)
  setIsLoading(true);
  setTimeout(() => {
    const botResponse: Message = {
      id: (Date.now() + 100).toString(),
      text: `Thanks for your question about "${inputValue}". As a medical device engineer, I've worked on various regulatory compliance projects and embedded systems designs.`,
      isUser: false,
    };
    
    setMessages(prevMessages => [...prevMessages, botResponse]);
    setIsLoading(false);
  }, 1000);
};
```

### Auto-scrolling Messages

```typescript
// Effect hook to scroll to bottom when messages change
useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
}, [messages]);
```

## Full Component JSX

```typescript
return (
  <div 
    className={chatCardClasses}
    onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouseLeave}
  >
    {/* Chat Header */}
    <div 
      className={headerClasses}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <h3 className="font-bold">Chat with me</h3>
      {isExpanded && (
        <button className="text-white opacity-80 hover:opacity-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </div>
    
    {/* Chat Content */}
    <div className="flex flex-col h-full">
      {/* Chat History */}
      <div className={historyContainerClasses}>
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div className={message.isUser ? getUserMessageClasses() : getBotMessageClasses()}>
              {message.text}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className={getBotMessageClasses()}>
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-100"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Chat Input */}
      <form onSubmit={handleSendMessage} className={inputContainerClasses}>
        <div className="flex">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask me about my experience..."
            className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-pink text-white px-4 py-2 rounded-r-lg hover:bg-opacity-90 disabled:opacity-50"
            disabled={isLoading || !inputValue.trim()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </form>
    </div>
  </div>
);
```

## Integration with App.tsx

To add the chat card to the application, we'll need to modify `App.tsx`:

```typescript
import React from 'react';
import HomePage from '../pages/HomePage.tsx';
import EnhancedChatCard from '../components/EnhancedChatCard.tsx';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-cream text-text">
      <main className="container mx-auto px-6 py-8 max-w-5xl">
        <div className="flex justify-between items-center mb-18">
          <div className="logo">
            DG
          </div>
          <a 
            href="#" 
            className="text-sm font-medium tracking-wide hover:text-pink transition-colors"
          >
            → BLOG
          </a>
        </div>
        <HomePage />
      </main>
      
      {/* Add the enhanced chat card */}
      <EnhancedChatCard />
    </div>
  );
};

export default App;
```

## Custom CSS in main.css

We'll need to add additional CSS to support the animations. Add these to `client/styles/main.css`:

```css
/* Chat animation classes */
@keyframes bounce-in {
  0% { transform: translateY(100%); }
  60% { transform: translateY(-10%); }
  100% { transform: translateY(0); }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-bounce-in {
  animation: bounce-in 0.5s ease-out;
}

.animate-fade-in {
  animation: fade-in 0.3s ease-in;
}

/* Add delay utilities */
.delay-100 {
  animation-delay: 0.1s;
}

.delay-200 {
  animation-delay: 0.2s;
}
```

## Implementation Steps

1. Create the `EnhancedChatCard.tsx` component in the `client/components/` directory
2. Add the custom CSS animations to `client/styles/main.css`
3. Update `App.tsx` to include the new chat component
4. Test the behavior of the chat card:
   - Hover functionality
   - Expansion on first message
   - Message scrolling
   - Responsiveness on different screen sizes
5. Make adjustments to z-index and positioning as needed
6. Ensure the expanded chat card properly overlays the center content while keeping the header visible

## Responsive Design Considerations

For smaller screens, adjust:
- Card width to be wider (90% vs 70% on desktop)
- Font sizes and padding to ensure readability
- Max height of expanded card to ensure visibility of important elements

This can be achieved with Tailwind's responsive modifiers:

```typescript
const chatCardClasses = `
  fixed bottom-0 left-0 right-0 mx-auto 
  w-11/12 md:w-4/5 lg:w-3/4 max-w-4xl
  bg-white rounded-t-2xl shadow-xl z-50 overflow-hidden
  transform transition-all duration-300 ease-in-out
  ${isExpanded 
    ? 'h-[80vh] md:h-[75vh] lg:h-[70vh] translate-y-0' 
    : isHovered 
      ? 'translate-y-[20%]' 
      : 'translate-y-[85%]'
  }
`;