import OpenAI from 'openai';

// This would typically be stored in an environment variable
// For now, we'll use a placeholder
const OPENAI_API_KEY = 'sk-placeholder-api-key';

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || OPENAI_API_KEY,
});

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function generateChatCompletion(
  messages: ChatMessage[],
  options?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  }
) {
  try {
    const completion = await openai.chat.completions.create({
      model: options?.model || 'gpt-4o',
      messages: messages,
      temperature: options?.temperature || 0.7,
      max_tokens: options?.maxTokens || 1000,
    });

    return completion.choices[0].message;
  } catch (error) {
    console.error('Error generating chat completion:', error);
    throw error;
  }
}

// Helper function to prepare system message with context/documentation
export function prepareSystemMessage(documentation?: string) {
  let baseSystemPrompt = `You are an AI assistant for Derek Gagnon's portfolio website. 
  You specialize in UX design with a focus on accessibility and neuroinclusive design. 
  Be helpful, informative, and concise in your responses.`;
  
  if (documentation) {
    baseSystemPrompt += `\n\nHere is some additional context about Derek's work: ${documentation}`;
  }
  
  return {
    role: 'system' as const,
    content: baseSystemPrompt,
  };
}
