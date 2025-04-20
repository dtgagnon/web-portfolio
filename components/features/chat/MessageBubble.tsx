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
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const getMessageContent = () => {
    if (typeof message.content === 'string') {
      return message.content;
    }
    return extractMessageContent(message.content);
  };

  // Determine the styling based on message role
  const getBubbleStyle = () => {
    if (message.role === 'user') {
      return 'ml-auto bg-pink text-black';
    } else if (message.role === 'assistant') {
      return 'mr-auto bg-green text-black';
    } else {
      // System messages (errors, notifications)
      return 'mx-auto bg-gray-300 dark:bg-gray-700 text-black dark:text-white italic text-sm';
    }
  };

  return (
    <div className={`p-3 my-2 rounded-lg max-w-[85%] ${getBubbleStyle()}`}>
      <p className="whitespace-pre-wrap break-words">{getMessageContent()}</p>
      {message.role !== 'system' && (
        <div className="text-xs mt-1 text-gray-600 dark:text-gray-300 text-right">
          {new Date(message.created_at * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      )}
    </div>
  );
};

export { MessageBubble };
export default MessageBubble;