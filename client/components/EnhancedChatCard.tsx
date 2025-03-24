import React, { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
}

const EnhancedChatCard: React.FC = () => {
  // State management
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I can answer questions about my experience in medical device engineering. What would you like to know?',
      isUser: false,
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when expanded
  useEffect(() => {
    if (isExpanded && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isExpanded, isMinimized]);

  // Handlers
  const handleMouseEnter = () => {
    if (!isExpanded || isMinimized) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isExpanded || isMinimized) {
      setIsHovered(false);
    }
  };

  const minimizeChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMinimized(true);
    setIsExpanded(false);
  };

  const restoreChat = () => {
    if (isMinimized) {
      setIsMinimized(false);
      setIsExpanded(true);
      setUnreadMessages(0);
    }
  };

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isExpanded) {
      setIsMinimized(true);
      setIsExpanded(false);
    } else {
      setIsExpanded(true);
      setIsMinimized(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // If minimized or not expanded, expand the chat
    if (isMinimized || !isExpanded) {
      setIsExpanded(true);
      setIsMinimized(false);
    }
    
    try {
      // Simulate bot response - in a real implementation, this would call an API
      setTimeout(() => {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: `I'd be happy to discuss my experience with ${inputValue}. As a medical device engineer, I've worked on various projects including regulatory compliance, quality systems, and innovative device design.`,
          isUser: false,
        };
        
        setMessages((prev) => [...prev, botResponse]);
        setIsLoading(false);

        // If minimized, increment unread count
        if (isMinimized) {
          setUnreadMessages(prev => prev + 1);
        }
      }, 1000);
      
    } catch (error) {
      console.error('Error getting response:', error);
      setIsLoading(false);
    }
  };

  return (
    <div 
      ref={cardRef}
      className={`
        fixed bottom-0 left-0 right-0 mx-auto 
        w-11/12 md:w-4/5 lg:w-3/4 max-w-3xl
        bg-white rounded-t-2xl shadow-xl z-50
        transition-all duration-300 ease-in-out
      `}
      style={{
        height: isExpanded && !isMinimized ? '80vh' : 'auto',
        transform: isExpanded && !isMinimized 
          ? 'translateY(0)' 
          : isHovered && !isExpanded
            ? 'translateY(70%)' 
            : 'translateY(90%)'
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Chat Header */}
      <div 
        className="p-4 bg-pink text-white rounded-t-2xl cursor-pointer flex items-center justify-between"
        onClick={toggleExpand}
      >
        <div className="flex items-center space-x-2">
          <h3 className="font-bold">Chat with me</h3>
          {isMinimized && unreadMessages > 0 && (
            <span className="bg-white text-pink text-xs px-2 py-0.5 rounded-full">
              {unreadMessages} unread
            </span>
          )}
        </div>
        <div className="flex space-x-2">
          {/* Minimize Button */}
          {isExpanded && !isMinimized && (
            <button 
              onClick={minimizeChat}
              className="text-white opacity-80 hover:opacity-100 transition-opacity"
              aria-label="Minimize chat"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          )}
          
          {/* Expand/Collapse Button */}
          <button 
            onClick={toggleExpand}
            className="text-white opacity-80 hover:opacity-100 transition-opacity"
            aria-label={isExpanded ? "Collapse chat" : "Expand chat"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              {isExpanded && !isMinimized ? (
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              ) : (
                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
              )}
            </svg>
          </button>
        </div>
      </div>
      
      {/* Chat Content */}
      <div className={`flex flex-col ${isExpanded && !isMinimized ? 'h-[calc(100%-4rem)]' : ''}`}>
        {/* Chat History */}
        <div 
          className={`
            flex-grow overflow-y-auto p-4 
            ${isExpanded && !isMinimized ? 'block animate-fade-in' : 'hidden'}
          `}
        >
          {messages.map(message => (
            <div 
              key={message.id} 
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-3`}
            >
              <div className={`
                p-3 rounded-lg max-w-[80%]
                ${message.isUser 
                  ? 'bg-pink text-white rounded-br-none' 
                  : 'bg-cream text-dark rounded-bl-none'
                }
              `}>
                {message.text}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start mb-3">
              <div className="bg-cream text-dark p-3 rounded-lg rounded-bl-none">
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
        <form 
          onSubmit={handleSubmit} 
          className={`
            border-t border-gray-200 p-4
            ${isExpanded && !isMinimized ? 'block' : isHovered && !isExpanded ? 'block' : 'hidden'}
          `}
        >
          <div className="flex">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me about my experience..."
              className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink"
              disabled={isLoading}
              onClick={(e) => {
                if (isMinimized) {
                  e.stopPropagation();
                  restoreChat();
                }
              }}
            />
            <button
              type="submit"
              className="bg-pink text-white px-4 py-2 rounded-r-lg hover:bg-opacity-90 disabled:opacity-50 transition-colors"
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
      
      {/* Minimized indicator */}
      {isMinimized && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-pink animate-pulse"></div>
      )}
      
      {/* Expanded overlay - covers content but keeps header visible */}
      {isExpanded && !isMinimized && (
        <div 
          className="fixed inset-0 bg-cream bg-opacity-70 -z-10"
          style={{ top: '120px' }} // Keep header visible
        />
      )}
    </div>
  );
};

export default EnhancedChatCard;