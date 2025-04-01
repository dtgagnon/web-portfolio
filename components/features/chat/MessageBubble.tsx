// components/features/chat/MessageBubble.tsx
import React from 'react';
import { extractMessageContent } from '@/lib/api/llm/llmMsgExtractor';

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

interface MessageBubbleProps {
  message: Message;
  isDarkMode: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isDarkMode }) => {
  const getMessageContent = () => {
    if (typeof message.content === 'string') {
      return message.content;
    }
    return extractMessageContent(message.content);
  };

  // Determine the styling based on message role and dark mode
  const getBubbleStyle = () => {
    if (message.role === 'user') {
      return `ml-auto ${isDarkMode ? 'bg-[#ff8fa3] text-[#1c1c1c]' : 'bg-[#ff8fa3] text-[#1c1c1c]'}`;
    } else if (message.role === 'assistant') {
      return `mr-auto ${isDarkMode ? 'bg-[#d4f7d4] text-[#1c1c1c]' : 'bg-[#d4f7d4] text-[#1c1c1c]'}`;
    } else {
      // System messages (errors, notifications)
      return `mx-auto ${isDarkMode ? 'bg-gray-700 text-[#faf8f2]' : 'bg-gray-300 text-[#1c1c1c]'} italic text-sm`;
    }
  };

  return (
    <div className={`p-3 my-2 rounded-lg max-w-[85%] ${getBubbleStyle()}`}>
      <p className="whitespace-pre-wrap break-words">{getMessageContent()}</p>
      {message.role !== 'system' && (
        <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-right`}>
          {new Date(message.created_at * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      )}
    </div>
  );
};

export { MessageBubble };
export default MessageBubble;