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
      return 'ml-auto bg-white dark:bg-gray-800 text-black dark:text-white';
    } else if (message.role === 'assistant') {
      return 'mr-auto bg-blue-100 text-black dark:bg-blue-900 dark:text-blue-100';
    } else {
      // System messages (errors, notifications)
      return 'mx-auto bg-gray-300 dark:bg-gray-700 text-black dark:text-white italic text-sm';
    }
  };

  return (
    <div className={`p-3 my-2 rounded-lg max-w-[85%] ${getBubbleStyle()}`}>
      <p className="break-words whitespace-pre-wrap">{getMessageContent()}</p>
      {message.role !== 'system' && (
        <div className="mt-1 text-xs text-right text-gray-600 dark:text-gray-300">
          {new Date(message.created_at * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      )}
    </div>
  );
};

export { MessageBubble };
export default MessageBubble;