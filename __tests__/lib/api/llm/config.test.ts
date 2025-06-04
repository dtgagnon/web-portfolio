import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ACTIVE_PROVIDER, getApiEndpoint, API_ENDPOINTS } from '@/lib/api/llm/config';

describe('LLM Config', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should use openai as default provider when no env var is set', () => {
    delete process.env.NEXT_PUBLIC_LLM_PROVIDER;
    expect(ACTIVE_PROVIDER).toBe('openai');
  });

  it('should return the correct API endpoint based on active provider', () => {
    expect(getApiEndpoint()).toBe(API_ENDPOINTS[ACTIVE_PROVIDER]);
    
    // This test is a bit brittle since it depends on the current value of ACTIVE_PROVIDER,
    // but it's useful to verify the function works correctly
    if (ACTIVE_PROVIDER === 'openai') {
      expect(getApiEndpoint()).toBe('/api/chat');
    } else if (ACTIVE_PROVIDER === 'gemini') {
      expect(getApiEndpoint()).toBe('/api/chat/gemini');
    }
  });
});
