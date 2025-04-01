"use client"; // Directive for client component

import React, { useState, useEffect, useRef } from 'react';
import { useCursorPosition } from '@/lib/useCursorPosition';
import { useDarkMode } from '../context/DarkModeContext';

// --- Helper Function for Cooldown Time Formatting ---
const formatCooldownTime = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds} second${seconds !== 1 ? 's' : ''}`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (remainingSeconds === 0) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }
  // Be less precise for longer durations for simplicity
  return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
};
// --- End Helper Function ---

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  created_at: number;
}

interface ChatCardProps {
  threshold?: number;
  content?: string;
}

export default function ChatCard({ threshold = 20, content = '' }: ChatCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [errorCount, setErrorCount] = useState(0);
  const [cooldownEndTime, setCooldownEndTime] = useState<number>(0); // Timestamp when cooldown ends
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const cursorPos = useCursorPosition();
  const { isDarkMode } = useDarkMode();

  // Scroll to bottom of messages when new ones arrive
  useEffect(() => {
    if (messagesEndRef.current && isOpen) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Load chat history from session storage on initial load
  useEffect(() => {
    const storedSessionId = sessionStorage.getItem('chatSessionId');
    if (storedSessionId) {
      setSessionId(storedSessionId);
      fetchChatHistory(storedSessionId);
    }
  }, []);

  // Chat card open/close behavior based on cursor position
  useEffect(() => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();

    const isInside = cursorPos.x > rect.left && cursorPos.x < rect.right &&
      cursorPos.y > rect.top && cursorPos.y < rect.bottom;
    if (isInside) return;

    const isNearTop = cursorPos.y >= rect.top - threshold && cursorPos.y <= rect.top &&
      cursorPos.x >= rect.left && cursorPos.x <= rect.right;
    const isNearBottom = cursorPos.y >= rect.bottom && cursorPos.y <= rect.bottom + threshold &&
      cursorPos.x >= rect.left && cursorPos.x <= rect.right;
    const isNearLeft = cursorPos.x >= rect.left - threshold && cursorPos.x <= rect.left &&
      cursorPos.y >= rect.top && cursorPos.y <= rect.bottom;
    const isNearRight = cursorPos.x >= rect.right && cursorPos.x <= rect.right + threshold &&
      cursorPos.y >= rect.top && cursorPos.y <= rect.bottom;

    const shouldOpen = isNearTop || isNearBottom || isNearLeft || isNearRight;
    setIsOpen(shouldOpen);
  }, [cursorPos, threshold]);

  // Cooldown durations in seconds (5s, 30s, 2min, 5min, 10min)
  const COOLDOWN_PERIODS_SECONDS = [5, 30, 120, 300, 600];

  // Fetch chat history
  const fetchChatHistory = async (sid: string) => {
    try {
      const response = await fetch(`/api/chat?sessionId=${sid}`);

      if (!response.ok) {
        // Attempt to read error message, potentially non-JSON
        const errorText = await response.text(); 
        console.error(`Error fetching chat history (${response.status}):`, errorText);
        // Display a user-friendly error message in the chat
        setMessages(prev => [...prev, { id: 'error-fetch-' + Date.now(), role: 'system', content: `Chat service is currently unavailable. Please try again later.`, created_at: Date.now() / 1000 }]);
        return; 
      }
      
      // Check content type before parsing
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json();
        if (data.success && data.messages) {
          setMessages(data.messages);
        } else {
          console.error('Failed to parse chat history:', data);
        }
      } else {
        console.error('Received non-JSON response when fetching history');
        const textResponse = await response.text(); // Log the actual response
        console.error('Response text:', textResponse);
      }

    } catch (error) {
      console.error('Network or parsing error fetching chat history:', error);
      // Display a user-friendly error message in the chat for network/parsing errors
      setMessages(prev => [...prev, { id: 'error-fetch-net-' + Date.now(), role: 'system', content: `Chat service is currently unavailable. Please try again later.`, created_at: Date.now() / 1000 }]);
    }
  };

  // Send message to API
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    const userMessage = {
      id: Date.now().toString(),
      content: message,
      role: 'user' as const,
      created_at: Math.floor(Date.now() / 1000)
    };
    
    // Add user message to state immediately for better UX
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);
    
    // --- Check for active cooldown before sending ---
    const now = Date.now();
    if (now < cooldownEndTime) {
      const remainingSeconds = Math.ceil((cooldownEndTime - now) / 1000);
      console.warn(`Cooldown active. Please wait ${remainingSeconds}s`);
      // Optionally update a temporary message or do nothing
      setIsLoading(false);
      return; // Prevent sending during cooldown
    }
    // --- End cooldown check ---

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          sessionId
        }),
      });
      
      // --- Robust response handling ---
      if (!response.ok) {
         // Try to capture response body first, as it can only be read once
        let responseText = '[Could not read response]';
        let errorData = null;
        let contentType = null;
        
        try {
          contentType = response.headers.get("content-type");
          // Read the full response as text first
          responseText = await response.text();
          
          // Then try to parse it as JSON if appropriate
          if (contentType && contentType.indexOf("application/json") !== -1) {
            try {
              errorData = JSON.parse(responseText);
            } catch (parseError) {
              console.error("Failed to parse JSON error response:", parseError);
            }
          }
        } catch (textError) {
          console.error("Failed to read error response:", textError);
        }
        
        // Log the error with the text we've already captured
        console.error(`Error sending message (${response.status}):`, errorData || responseText);
        // Show an error in the chat UI
        const nextErrorCount = Math.min(errorCount + 1, COOLDOWN_PERIODS_SECONDS.length); // Cap error count
        const cooldownSeconds = COOLDOWN_PERIODS_SECONDS[nextErrorCount - 1];
        const newCooldownEndTime = Date.now() + cooldownSeconds * 1000;
        
        setErrorCount(nextErrorCount);
        setCooldownEndTime(newCooldownEndTime);

        setMessages(prev => [...prev, { 
          id: 'error-send-' + Date.now(), 
          role: 'system', 
          content: `Chat service is currently unavailable. Please try again after ${formatCooldownTime(cooldownSeconds)}.`, 
          created_at: Date.now() / 1000 
        }]);
        setIsLoading(false); // Ensure loading state is reset
        return; 
      }

      // --- Handle successful JSON response ---
      let contentType = null;
      try {
        contentType = response.headers.get("content-type");
      } catch (error) {
        console.error("Error getting content type:", error);
      }
      if (contentType && contentType.indexOf("application/json") !== -1) {
        try {
          const data = await response.json();
          if (data.success && data.assistantResponse) {
            setMessages(prev => [...prev, data.assistantResponse]);
            if (data.sessionId) {
              setSessionId(data.sessionId);
              sessionStorage.setItem('chatSessionId', data.sessionId);
            }
            // Reset error count on success
            setErrorCount(0);
            setCooldownEndTime(0); // Reset cooldown on success
          } else {
            // Handle cases where JSON is valid but doesn't have expected data
            console.error('Successful response missing expected data:', data);
            setMessages(prev => [...prev, { id: 'error-data-' + Date.now(), role: 'system', content: 'Received an unexpected response from the server.', created_at: Date.now() / 1000 }]);
          }
        } catch (parseError) {
          console.error("Failed to parse successful JSON response:", parseError);
          // Also log the raw text if possible to help debug
          try {
            const errorText = await response.text();
            console.error("Raw response text:", errorText);
          } catch (textError) {
            console.error("Failed to read response text after JSON parse error:", textError);
          }
          setMessages(prev => [...prev, { id: 'error-parse-' + Date.now(), role: 'system', content: 'Failed to read the server\'s response. Please try again.', created_at: Date.now() / 1000 }]);
          // Optionally trigger cooldown here too if unexpected success format is treated as an error
          // const nextErrorCount = Math.min(errorCount + 1, COOLDOWN_PERIODS_SECONDS.length);
          // const cooldownSeconds = COOLDOWN_PERIODS_SECONDS[nextErrorCount - 1];
          // const newCooldownEndTime = Date.now() + cooldownSeconds * 1000;
          // setErrorCount(nextErrorCount);
          // setCooldownEndTime(newCooldownEndTime);
        }
      } else {
        // Handle successful responses that are not JSON
        console.warn('Received successful non-JSON response');
        // Try reading as text, but handle potential errors
        let responseText = '[Could not read non-JSON response text]'; 
        try {
          responseText = await response.text(); 
          console.warn('Response text:', responseText);
        } catch (textReadError) {
          console.error("Failed to read text from successful non-JSON response:", textReadError);
        }
        // Decide how to handle this - maybe display a generic message?
        setMessages(prev => [...prev, { id: 'warn-nonjson-' + Date.now(), role: 'system', content: 'Received an unexpected response format from the server.', created_at: Date.now() / 1000 }]);
      }

      setIsLoading(false);
    } catch (error) {
      // --- Network Error Handling ---
      console.error('Network error sending message:', error);
      
      const nextErrorCount = Math.min(errorCount + 1, COOLDOWN_PERIODS_SECONDS.length); // Cap error count
      const cooldownSeconds = COOLDOWN_PERIODS_SECONDS[nextErrorCount - 1];
      const newCooldownEndTime = Date.now() + cooldownSeconds * 1000;

      setErrorCount(nextErrorCount);
      setCooldownEndTime(newCooldownEndTime);
      
      setMessages(prev => [...prev, { 
          id: 'error-network-' + Date.now(), 
          role: 'system', 
          content: `Failed to connect to chat service. Please try again after ${formatCooldownTime(cooldownSeconds)}.`, 
          created_at: Date.now() / 1000 
        }]);
      setIsLoading(false); // Ensure loading state is reset on network error
    }
  };

  return (
    <div 
      className={`fixed bottom-0 origin-bottom left-1/2 w-80 max-h-[400px] border border-[#3c4e74] rounded-t-[8px] shadow-[0_-2px_10px_rgba(0,0,0,.2)]
      transition-transform duration-300 ease-in-out cursor-pointer z-50
      ${isOpen ? 'translate-x-[-50%] translate-y-0' : 'translate-x-[-50%] translate-y-[calc(100%-2.5rem)]'}`}
      style={{
        backgroundColor: isDarkMode ? '#1c1c1c' : '#faf8f2',
        color: isDarkMode ? '#faf8f2' : '#1c1c1c',
      }}
      ref={cardRef}
      onMouseEnter={() => !isOpen && setIsOpen(true)}
    >
      <div 
        className={`flex ${isDarkMode ? 'bg-[#3c4e74] text-[#faf8f2]' : 'bg-[#3c4e74] text-[#faf8f2]'} rounded-t-[8px] items-center justify-between p-2`} 
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-sm font-medium">Chat with Derek's Portfolio</span>
        <span className="text-sm">{isOpen ? '▼' : '▲'}</span>
      </div>
      
      {isOpen && (
        <div className="flex flex-col h-[350px]">
          {/* Message history area */}
          <div className="flex-grow overflow-y-auto p-3" style={{ maxHeight: 'calc(350px - 60px)' }}>
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 italic py-4">
                <p>No messages yet. Start a conversation!</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`mb-3 max-w-[85%] ${
                    msg.role === 'user' ? 'ml-auto' : 
                    msg.role === 'assistant' ? 'mr-auto' :
                    'mx-auto text-center w-full' // Center system messages
                  }`}
                >
                  <div 
                    className={`p-2 rounded-md text-sm ${
                      msg.role === 'user' 
                        ? `bg-[#ff8fa3] text-[#1c1c1c]` 
                        : msg.role === 'assistant'
                        ? `bg-[#d4f7d4] text-[#1c1c1c]`
                        : `bg-gray-200 text-gray-600 italic` // Style for system messages
                    }`}
                  >
                    {msg.content}
                  </div>
                  <div className="text-xs opacity-60 mt-1">
                    {new Date(msg.created_at * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Message input form */}
          <form onSubmit={sendMessage} className={`p-3 border-t border-[#3c4e74] ${isDarkMode ? 'bg-[#1c1c1c]' : 'bg-[#faf8f2]'}`}>
            <div className="flex items-center">
              <input
                className={`flex-grow p-2 border border-[#3c4e74] rounded-l-md ${isDarkMode ? 'bg-[#2a2a2a] text-[#faf8f2]' : 'bg-[#ffffff] text-[#1c1c1c]'}`}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                disabled={isLoading || Date.now() < cooldownEndTime} // Disable input during cooldown
              />
              <button
                type="submit"
                disabled={isLoading || !message.trim() || Date.now() < cooldownEndTime} // Disable button during cooldown
                className={`p-2 border border-l-0 border-[#3c4e74] rounded-r-md ${
                  isLoading || !message.trim() || Date.now() < cooldownEndTime 
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : 'bg-[#ff8fa3] hover:bg-pink-300'
                } text-white`}
              >
                {isLoading ? (
                  <span className="inline-block animate-spin">⟳</span>
                ) : (
                  <span>Send</span>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
