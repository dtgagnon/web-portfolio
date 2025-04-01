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

export const extractMessageContent = (content: Message['content']): string => {
  // If content is already a string, return it directly
  if (typeof content === 'string') {
    return content;
  }
  
  // If content is an array (OpenAI format), extract text values
  if (Array.isArray(content)) {
    return content
      .filter(part => part.type === 'text' && part.text?.value)
      .map(part => part.text?.value)
      .join('\n');
  }
  
  // Fallback for unexpected formats
  return 'Unable to display message content';
}