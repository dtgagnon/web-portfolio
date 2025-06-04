/**
 * LLM Provider Configuration
 * 
 * This file contains configuration for which LLM provider to use.
 * Set the ACTIVE_PROVIDER to control which backend the chat uses.
 */

export type LLMProvider = 'openai' | 'gemini';

// The active provider - change this value to switch between providers
// This should be configured by environment variable in production
export const ACTIVE_PROVIDER: LLMProvider = 
  (process.env.NEXT_PUBLIC_LLM_PROVIDER as LLMProvider) || 'openai';

// Provider-specific API endpoints
export const API_ENDPOINTS = {
  openai: '/api/chat/openai',
  gemini: '/api/chat/gemini'
};

// Helper function to get the current API endpoint
export const getApiEndpoint = (): string => {
  return API_ENDPOINTS[ACTIVE_PROVIDER];
};
