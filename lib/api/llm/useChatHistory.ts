import { useState, useEffect, useCallback } from 'react';
import { ACTIVE_PROVIDER, getApiEndpoint } from './config';

interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  created_at: number;
  isStreaming?: boolean;
}

interface StreamEvent {
  type: 'content' | 'complete' | 'error';
  content?: string;
  threadId?: string; // OpenAI uses threadId
  sessionId?: string; // Gemini uses sessionId
}

const useChatHistory = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null); // Track userId for Gemini
  
  // Get current API endpoint based on active provider
  const apiEndpoint = getApiEndpoint();
  
  // Helper to safely get messages from API response
  const getMessagesFromResponse = useCallback((data: any): ChatMessage[] => {
    if (!data?.messages || !Array.isArray(data.messages)) {
      return [];
    }
    
    return data.messages.map((msg: any) => ({
      id: msg.id || `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content: typeof msg.content === 'string' 
        ? msg.content 
        : (typeof msg.text === 'string' 
            ? msg.text 
            : (typeof msg.message === 'string' 
                ? msg.message 
                : 'Message content unavailable')),
      role: ['user', 'assistant', 'system'].includes(msg.role) 
        ? (msg.role as 'user' | 'assistant' | 'system') 
        : 'system',
      created_at: typeof msg.created_at === 'number' && !isNaN(msg.created_at) 
        ? msg.created_at 
        : Math.floor(Date.now() / 1000)
    }));
  }, []);

  // Fetch chat history
  const fetchChatHistory = useCallback(async (sid: string | null) => {
    if (!sid) {
      console.warn('No session ID provided to fetchChatHistory');
      return;
    }
    
    try {
      const response = await fetch(`${apiEndpoint}?sessionId=${sid}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error fetching chat history:`, errorText);
        
        setMessages(prev => [...prev, { 
          id: `error-${Date.now()}`,
          role: 'system',
          content: 'Failed to load chat history. Please refresh the page.',
          created_at: Math.floor(Date.now() / 1000)
        }]);
        return;
      }
      
      const data = await response.json();
      const normalizedMessages = getMessagesFromResponse(data);
      setMessages(normalizedMessages);
      
    } catch (error) {
      console.error('Error fetching chat history:', error);
      setMessages(prev => [...prev, { 
        id: `error-${Date.now()}`,
        role: 'system',
        content: 'Network error. Please check your connection.',
        created_at: Math.floor(Date.now() / 1000)
      }]);
    }
  }, [getMessagesFromResponse]);

  // Initialize session ID and user ID from storage
  useEffect(() => {
    const storedSessionId = sessionStorage.getItem('chatSessionId');
    let storedUserId = localStorage.getItem('userId');
    
    // Always ensure we have a userId, even if localStorage failed
    if (!storedUserId) {
      // Generate a persistent user ID if none exists
      storedUserId = `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem('userId', storedUserId);
      console.log('Created new userId:', storedUserId);
    } else {
      console.log('Found existing userId:', storedUserId);
    }
    
    // Always set the userId, ensuring it's never null or undefined
    setUserId(storedUserId);
    
    if (storedSessionId) {
      setSessionId(storedSessionId);
      fetchChatHistory(storedSessionId);
    }
  }, [fetchChatHistory]);

  // Send message to API with streaming support
  const sendMessage = useCallback(async (messageText: string) => {
    if (!messageText.trim()) return false;
    
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      content: messageText,
      role: 'user',
      created_at: Math.floor(Date.now() / 1000)
    };
    
    // Add user message to chat
    setMessages(prev => [...prev, userMessage]);
    
    // Create a temporary assistant message that we'll update with the stream
    const assistantMessageId = `msg-${Date.now()}-assistant`;
    const assistantMessage: ChatMessage = {
      id: assistantMessageId,
      content: '',
      role: 'assistant',
      created_at: Math.floor(Date.now() / 1000),
      isStreaming: true
    };
    
    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(true);
    
    try {
      // Set a hardcoded userId for testing if none exists
      const effectiveUserId = userId || 'fallback-user-id-' + Date.now();
      
      console.log('[DEBUG] Chat - About to send request');
      console.log('[DEBUG] Chat - userId value:', effectiveUserId);
      console.log('[DEBUG] Chat - sessionId value:', sessionId);
      
      const requestPayload = {
        message: messageText,
        sessionId: sessionId || undefined,
        userId: effectiveUserId // Ensure we always have a non-empty userId
      };
      
      console.log('[DEBUG] Chat - Full request payload:', JSON.stringify(requestPayload));
      
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload),
      });
      
      if (!response.body) {
        throw new Error('No response body');
      }
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Process the streaming response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let currentSessionId = sessionId;
      let accumulatedContent = '';
      
      // Read the stream
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          break;
        }
        
        // Decode the chunk
        const chunk = decoder.decode(value, { stream: true });
        
        // Process the chunk which may contain SSE format (data: prefix + double newlines) or legacy format (raw JSON + single newlines)
        let processedLines: string[] = [];
        
        // First try to split by SSE standard (double newlines)
        if (chunk.includes('\n\n')) {
          processedLines = chunk.split('\n\n').filter(line => line.trim() !== '');
        } 
        // Fall back to legacy format (single newlines)
        else {
          processedLines = chunk.split('\n').filter(line => line.trim() !== '');
        }
        
        for (const line of processedLines) {
          try {
            // Extract the JSON part by removing the 'data: ' prefix if present
            const jsonString = line.startsWith('data: ') ? line.substring(6) : line;
            if (!jsonString.trim()) continue;
            
            const data = JSON.parse(jsonString);
            
            if (data.type === 'content' && typeof data.content === 'string') {
              // Update the assistant's message with the new content
              accumulatedContent += data.content;
              
              setMessages(prev => prev.map(msg => 
                msg.id === assistantMessageId 
                  ? { ...msg, content: accumulatedContent }
                  : msg
              ));
            } 
            else if (data.type === 'complete') {
              // Update the session ID if this is a new thread/session
              // OpenAI uses threadId, Gemini uses sessionId
              const newId = data.threadId || data.sessionId || '';
              
              if (!currentSessionId && newId) {
                currentSessionId = newId;
                setSessionId(currentSessionId);
                sessionStorage.setItem('chatSessionId', currentSessionId || '');
              }
              
              // Mark the message as no longer streaming
              setMessages(prev => prev.map(msg => 
                msg.id === assistantMessageId 
                  ? { ...msg, isStreaming: false }
                  : msg
              ));
            }
            else if (data.type === 'error') {
              throw new Error(data.content || 'Unknown error');
            }
          } catch (e) {
            console.error('Error parsing chunk:', e);
          }
        }
      }
      
      setIsLoading(false);
      return true;
      
    } catch (error) {
      console.error('Error in sendMessage:', error);
      
      // Update the assistant message with the error
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessageId
          ? { 
              ...msg, 
              content: 'Sorry, there was an error processing your message. Please try again.',
              isStreaming: false 
            }
          : msg
      ));
      
      setIsLoading(false);
      return false;
    }
  }, [sessionId]);

  // Clear chat history
  const clearChat = useCallback(async () => {
    if (sessionId) {
      try {
        await fetch(`${apiEndpoint}?sessionId=${sessionId}`, { 
          method: 'DELETE' 
        });
      } catch (error) {
        console.error('Error clearing chat:', error);
      }
    }
    
    // Clear local state
    setMessages([]);
    setSessionId(null);
    sessionStorage.removeItem('chatSessionId');
  }, [sessionId]);

  return {
    messages,
    setMessages,
    sessionId,
    userId,
    isLoading,
    setIsLoading,
    fetchChatHistory,
    sendMessage,
    clearChat,
    activeProvider: ACTIVE_PROVIDER
  };
};

export default useChatHistory;
