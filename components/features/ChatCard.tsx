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
  // Add optional fields that might be present in API responses
  text?: string;
  message?: string;
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
        setMessages(prev => [...prev, { id: 'error-fetch-' + Date.now(), role: 'system', content: `Chat service is currently unavailable. Please try again later.`, created_at: Math.floor(Date.now() / 1000) }]);
        return; 
      }
      
      // Check content type before parsing
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json();
        if (data.success && data.messages) {
          // Validate and normalize messages before setting state
          const normalizedMessages = data.messages.map((msg: any) => {
            // Ensure each message has the required fields with proper types
            const normalizedMsg: Message = {
              id: msg.id || `normalized-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
              content: typeof msg.content === 'string' ? msg.content : 
                      (msg.text || msg.message || 'Message content unavailable'),
              role: ['user', 'assistant', 'system'].includes(msg.role) ? 
                    (msg.role as 'user' | 'assistant' | 'system') : 'system',
              created_at: typeof msg.created_at === 'number' && !isNaN(msg.created_at) ? 
                         msg.created_at : Math.floor(Date.now() / 1000)
            };
            
            // Store original text/message fields if present for future reference
            if (typeof msg.text === 'string') normalizedMsg.text = msg.text;
            if (typeof msg.message === 'string') normalizedMsg.message = msg.message;
            
            return normalizedMsg;
          });
          setMessages(normalizedMessages);
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
      setMessages(prev => [...prev, { id: 'error-fetch-net-' + Date.now(), role: 'system', content: `Chat service is currently unavailable. Please try again later.`, created_at: Math.floor(Date.now() / 1000) }]);
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
      setIsLoading(false); // Need to reset loading if cooldown prevents sending
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
          content: `Error: ${errorData?.error || responseText}. Cooldown activated for ${formatCooldownTime(cooldownSeconds)}.`, 
          created_at: Math.floor(Date.now() / 1000) 
        }]);
      } else { // response.ok is true
        const data = await response.json();

        if (data.success) {
          // Update session ID if it's new
          if (data.sessionId && !sessionId) {
            setSessionId(data.sessionId);
            sessionStorage.setItem('chatSessionId', data.sessionId);
          }

          // Add the assistant's message to the state, prioritizing responseContent
          let assistantText = '';
          if (data.responseContent) {
            assistantText = data.responseContent;
          } else if (data.message && data.message.content) {
            // Fallback to message.content if responseContent is missing (less likely now)
            console.warn("Using fallback data.message.content as data.responseContent was missing.");
            assistantText = data.message.content;
          }

          if (assistantText) {
            // Construct the message object for the UI
            const assistantMessage: Message = {
              // Use DB message ID if available AND if we used message.content, otherwise generate
              id: (data.message && !data.responseContent) ? (data.message.id || `assistant-${Date.now()}`) : `assistant-${Date.now()}`,
              content: assistantText,
              role: 'assistant',
              // Use DB timestamp if available AND if we used message.content, otherwise now
              created_at: (data.message && !data.responseContent) ? (data.message.created_at || Math.floor(Date.now() / 1000)) : Math.floor(Date.now() / 1000),
            };
            setMessages(prev => [...prev, assistantMessage]);
          } else {
            // This case should be rare now, but handle it
            console.error('Received success response but no assistant content found in responseContent or message.content:', data);
            setMessages(prev => [...prev, {
              id: 'error-no-content-' + Date.now(),
              role: 'system',
              content: 'Received an incomplete response from the assistant.',
              created_at: Math.floor(Date.now() / 1000)
            }]);
          }

          setErrorCount(0); // Reset error count on success
          setCooldownEndTime(0); // Reset cooldown on success

        } else {
          // Handle backend reporting success: false
          console.error('API indicated failure:', data.error);
          // Implement cooldown based on error count
          const nextErrorCount = Math.min(errorCount + 1, COOLDOWN_PERIODS_SECONDS.length);
          const cooldownSeconds = COOLDOWN_PERIODS_SECONDS[nextErrorCount - 1];
          const newCooldownEndTime = Date.now() + cooldownSeconds * 1000;
          
          setErrorCount(nextErrorCount);
          setCooldownEndTime(newCooldownEndTime);

          setMessages(prev => [...prev, { 
            id: 'error-api-fail-' + Date.now(), 
            role: 'system', 
            content: `Assistant Error: ${data.error || 'Unknown error'}. Cooldown activated for ${formatCooldownTime(cooldownSeconds)}.`, 
            created_at: Math.floor(Date.now() / 1000) 
          }]);
        }
      }
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
          created_at: Math.floor(Date.now() / 1000) 
        }]);
    } finally {
      setIsLoading(false); // Ensure loading state is always reset
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
      aria-label="Chat with portfolio"
      role="region"
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
                <p className="text-xs mt-2">Ask me about my UX design work, accessibility expertise, or neuroinclusive design approach.</p>
              </div>
            ) : (
              messages.map((msg) => {
                // --- Enhanced validation --- 
                if (!msg || typeof msg !== 'object') {
                  console.error("Invalid message object found in state:", msg);
                  return null; // Don't render invalid entries
                }
                
                // Try to safely access properties with fallbacks
                const messageId = msg.id || `fallback-${Math.random().toString(36).substring(2, 9)}`;
                const messageContent = typeof msg.content === 'string' ? msg.content : 
                                      ((msg as any).text || (msg as any).message || 'Message content unavailable');
                const messageRole = ['user', 'assistant', 'system'].includes(msg.role) ? 
                                    msg.role : 'system';
                const messageTimestamp = typeof msg.created_at === 'number' && !isNaN(msg.created_at) ? 
                                        msg.created_at : Math.floor(Date.now() / 1000);
                
                // Log detailed information for debugging
                if (typeof msg.content !== 'string' || typeof msg.created_at !== 'number' || isNaN(msg.created_at)) {
                  console.warn("Message format issue detected:", {
                    id: messageId,
                    originalContent: msg.content,
                    originalTimestamp: msg.created_at,
                    using: {
                      content: messageContent,
                      timestamp: messageTimestamp
                    }
                  });
                  
                  // Report error to monitoring system if available
                  if (typeof window !== 'undefined' && window.onerror) {
                    window.onerror(
                      `Error rendering message (ID: ${messageId})`,
                      'ChatCard.tsx',
                      0,
                      0,
                      new Error('Invalid message format')
                    );
                  }
                }
                // --- End enhanced validation ---
                
                // Use the safe values from our validation
                return (
                  <div 
                    key={messageId} 
                    className={`mb-3 max-w-[85%] ${
                      messageRole === 'user' ? 'ml-auto' : 
                      messageRole === 'assistant' ? 'mr-auto' :
                      'mx-auto text-center w-full' // Center system messages
                    }`}
                  >
                    <div 
                      className={`p-2 rounded-md text-sm ${
                        messageRole === 'user' 
                          ? `bg-[#ff8fa3] text-[#1c1c1c]` 
                          : messageRole === 'assistant'
                          ? `bg-[#d4f7d4] text-[#1c1c1c]`
                          : `bg-gray-200 text-gray-600 italic` // Style for system messages
                      }`}
                    >
                      {messageContent}
                    </div>
                    <div className="text-xs opacity-60 mt-1">
                      {new Date(messageTimestamp * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </div>
                );
              })
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
