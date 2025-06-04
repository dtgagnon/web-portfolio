# Gemini API Migration Plan

## Overview
Migrate the chat functionality from OpenAI's API to Google's Gemini API while maintaining the existing user experience.

## Branch
`feature/gemini-migration`

## Setup Instructions

### 1. Google Cloud Setup
1. Install and initialize the Google Cloud CLI
2. Set up authentication:
   ```bash
   gcloud auth application-default login
   ```
3. Set environment variables in `.env.local`:
   ```
   GOOGLE_CLOUD_PROJECT=your-project-id
   GOOGLE_CLOUD_LOCATION=global  # or your preferred location
   GOOGLE_GENAI_USE_VERTEXAI=true
   ```

### 2. Dependencies
- [x] Add `@google/genai` package
- [ ] Set up environment variables in Vercel/Netlify
- [ ] Update deployment documentation

### 3. API Route Updates
- [x] Create new chat route handler for Gemini using `@google-cloud/vertexai`
- [x] Implement streaming response handling with Gemini's streaming API
- [x] Update request/response types to match Gemini's API schema
- [x] Add error handling
- [x] Implement conversation history management
- [ ] Add rate limiting

### 4. Client-Side Updates
- [x] Create configuration system to switch between OpenAI and Gemini backends
- [x] Update chat component to work with both API endpoints
- [x] Handle streaming responses consistently between providers
- [x] Update TypeScript types for API responses
- [x] Properly handle sessionId and userId parameters
- [x] Add loading states and error handling

### 5. Testing
- [x] Unit tests for LLM configuration system
- [x] Manual testing of Gemini API functionality
- [x] Test streaming responses and session management
- [ ] Additional integration tests for chat flow
- [ ] Performance testing and optimization
- [ ] Test error scenarios and edge cases

### 6. Documentation
- [x] Add environment configuration for LLM provider switching
- [ ] Update API documentation for new endpoints
- [x] Add setup instructions for Google Cloud and Gemini API
- [ ] Document any breaking changes from the previous implementation
- [ ] Add examples for common use cases
- [ ] Update README with new setup instructions

## Switching Between Providers

The application now supports switching between LLM providers using a configuration system:

1. Set `NEXT_PUBLIC_LLM_PROVIDER` in your `.env.local` file to either `openai` or `gemini`
2. Restart the Next.js development server

The configuration is managed by:
- `/lib/api/llm/config.ts` - Defines provider configuration and API endpoints
- `/lib/api/llm/useChatHistory.ts` - Updated to support both providers and handle differences

## Rollback Plan
If issues arise, we can revert to the previous OpenAI implementation by:
1. Setting `NEXT_PUBLIC_LLM_PROVIDER=openai` in your environment
2. Reverting the git branch if needed
3. Rolling back any database migrations
