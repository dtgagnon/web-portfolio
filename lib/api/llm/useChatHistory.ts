import { useState, useEffect } from 'react';
import { extractMessageContent } from './llmMsgExtractor';

interface Message {
  id: string;
  content: string | Array<{
    type: string;
    text?: {
      value: string;
      annotations: Array<any>;
    };
  }>;
  role: 'user' | 'assistant' | 'system';
  created_at: number;
  text?: string;
  message?: string;
}

const useChatHistory = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize session ID from storage
  useEffect(() => {
    const storedSessionId = sessionStorage.getItem('chatSessionId');
    if (storedSessionId) {
      setSessionId(storedSessionId);
      fetchChatHistory(storedSessionId);
    }
  }, []);

  // Fetch chat history
  const fetchChatHistory = async (sid: string) => {
    try {
      const response = await fetch(`/api/chat?sessionId=${sid}`);

      if (!response.ok) {
        const errorText = await response.text(); 
        console.error(`Error fetching chat history (${response.status}):`, errorText);
        setMessages(prev => [...prev, { 
          id: 'error-fetch-' + Date.now(), 
          role: 'system', 
          content: `Chat service is currently unavailable. Please try again later.`, 
          created_at: Math.floor(Date.now() / 1000) 
        }]);
        return; 
      }
      
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json();
        if (data.success && data.messages) {
          const normalizedMessages = data.messages.map((msg: any) => {
            const normalizedMsg: Message = {
              id: msg.id || `normalized-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
              content: typeof msg.content === 'string' ? msg.content : 
                      (msg.text || msg.message || 'Message content unavailable'),
              role: ['user', 'assistant', 'system'].includes(msg.role) ? 
                    (msg.role as 'user' | 'assistant' | 'system') : 'system',
              created_at: typeof msg.created_at === 'number' && !isNaN(msg.created_at) ? 
                         msg.created_at : Math.floor(Date.now() / 1000)
            };
            
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
        const textResponse = await response.text();
        console.error('Response text:', textResponse);
      }
    } catch (error) {
      console.error('Network or parsing error fetching chat history:', error);
      setMessages(prev => [...prev, { 
        id: 'error-fetch-net-' + Date.now(), 
        role: 'system', 
        content: `Chat service is currently unavailable. Please try again later.`, 
        created_at: Math.floor(Date.now() / 1000) 
      }]);
    }
  };

  // Send message to API
  const sendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;
    
    const userMessage = {
      id: Date.now().toString(),
      content: messageText,
      role: 'user' as const,
      created_at: Math.floor(Date.now() / 1000)
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
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
      
      if (!response.ok) {
        let responseText = '[Could not read response]';
        let errorData = null;
        let contentType = null;
        
        try {
          contentType = response.headers.get("content-type");
          responseText = await response.text();
          
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
        
        console.error(`Error sending message (${response.status}):`, responseText);
        
        // Add error message to chat
        setMessages(prev => [...prev, { 
          id: 'error-send-' + Date.now(), 
          role: 'system', 
          content: `Failed to send message. Please try again later.`, 
          created_at: Math.floor(Date.now() / 1000) 
        }]);
        
        setIsLoading(false);
        return false;
      }
      
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json();
        
        if (data.success) {
          // If this is a new session, store the session ID
          if (data.sessionId && !sessionId) {
            setSessionId(data.sessionId);
            sessionStorage.setItem('chatSessionId', data.sessionId);
          }
          
          // Add assistant message to chat
          if (data.response) {
            const assistantMessage = {
              id: data.messageId || `assistant-${Date.now()}`,
              content: data.response,
              role: 'assistant' as const,
              created_at: Math.floor(Date.now() / 1000)
            };
            
            setMessages(prev => [...prev, assistantMessage]);
          }
          
          setIsLoading(false);
          return true;
        } else {
          console.error('API returned error:', data);
          
          // Add error message to chat
          setMessages(prev => [...prev, { 
            id: 'error-api-' + Date.now(), 
            role: 'system', 
            content: data.error || `Something went wrong. Please try again.`, 
            created_at: Math.floor(Date.now() / 1000) 
          }]);
          
          setIsLoading(false);
          return false;
        }
      } else {
        console.error('Received non-JSON response');
        const textResponse = await response.text();
        console.error('Response text:', textResponse);
        
        // Add error message to chat
        setMessages(prev => [...prev, { 
          id: 'error-format-' + Date.now(), 
          role: 'system', 
          content: `Received invalid response format. Please try again later.`, 
          created_at: Math.floor(Date.now() / 1000) 
        }]);
        
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Network error sending message:', error);
      
      // Add error message to chat
      setMessages(prev => [...prev, { 
        id: 'error-network-' + Date.now(), 
        role: 'system', 
        content: `Network error. Please check your connection and try again.`, 
        created_at: Math.floor(Date.now() / 1000) 
      }]);
      
      setIsLoading(false);
      return false;
    }
  };

  return {
    messages,
    setMessages,
    sessionId,
    isLoading,
    setIsLoading,
    fetchChatHistory,
    sendMessage
  };
};

export default useChatHistory;
