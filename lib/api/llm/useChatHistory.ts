import { useState, useEffect, useCallback } from 'react';

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
  threadId?: string;
}

const useChatHistory = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
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
      const response = await fetch(`/api/chat?sessionId=${sid}`);
      
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

  // Initialize session ID from storage
  useEffect(() => {
    const storedSessionId = sessionStorage.getItem('chatSessionId');
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
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          sessionId: sessionId || undefined // Send undefined instead of null
        }),
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
        
        // Process each line (the API sends newline-separated JSON)
        const lines = chunk.split('\n').filter(line => line.trim() !== '');
        
        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            
            if (data.type === 'content' && typeof data.content === 'string') {
              // Update the assistant's message with the new content
              accumulatedContent += data.content;
              
              setMessages(prev => prev.map(msg => 
                msg.id === assistantMessageId 
                  ? { ...msg, content: accumulatedContent }
                  : msg
              ));
            } 
            else if (data.type === 'complete' && data.threadId) {
              // Update the session ID if this is a new thread
              if (!currentSessionId) {
                currentSessionId = data.threadId || '';
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
        await fetch(`/api/chat?sessionId=${sessionId}`, { 
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
    isLoading,
    setIsLoading,
    fetchChatHistory,
    sendMessage,
    clearChat
  };
};

export default useChatHistory;
