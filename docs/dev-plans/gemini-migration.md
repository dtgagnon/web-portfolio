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
- [x] Add `@google/genai` package — _Selected Google's official SDK for optimal compatibility and support._
- [ ] Set up environment variables in Vercel/Netlify
- [ ] Update deployment documentation

### 3. API Route Updates
- [x] Create new chat route handler for Gemini using `@google-cloud/vertexai` — _Decided to encapsulate Gemini functionality in dedicated route handler to isolate provider-specific code._
- [x] Implement streaming response handling with Gemini's streaming API — _Adopted text/event-stream format with custom stream events for consistent interface with frontend._
- [x] Update request/response types to match Gemini's API schema — _Defined StreamEvent interfaces to standardize the communication protocol._
- [x] Add error handling — _Implemented comprehensive try/catch blocks with detailed error logging and response formatting._
- [x] Implement conversation history management — _Created dual-ID approach to maintain user identity while enforcing database referential integrity._
- [ ] Add rate limiting

### 4. Client-Side Updates
- [x] Create configuration system to switch between OpenAI and Gemini backends — _Implemented environment-based configuration to allow seamless provider switching._
- [x] Update chat component to work with both API endpoints — _Refactored components to be provider-agnostic by abstracting API differences._
- [x] Handle streaming responses consistently between providers — _Standardized on event-stream format with newline-delimited JSON for cross-provider compatibility._
- [x] Update TypeScript types for API responses — _Created shared interface types to enforce consistency across providers._
- [x] Properly handle sessionId and userId parameters — _Implemented persistent client-side userId with fallbacks while ensuring proper database integrity._
- [x] Add loading states and error handling — _Added comprehensive UI states for all chat flow stages with graceful error recovery._

### 5. Testing
- [x] Unit tests for LLM configuration system — _Created Vitest tests to verify provider configuration and switching logic._
- [x] Manual testing of Gemini API functionality — _Verified end-to-end functionality including model response quality and format._
- [x] Test streaming responses and session management — _Validated real-time message streaming and proper session persistence across page reloads._
- [ ] Additional integration tests for chat flow
- [ ] Performance testing and optimization
- [ ] Test error scenarios and edge cases

### 6. Documentation
- [x] Add environment configuration for LLM provider switching — _Documented environment variable `NEXT_PUBLIC_LLM_PROVIDER` to control active provider._
- [ ] Update API documentation for new endpoints
- [x] Add setup instructions for Google Cloud and Gemini API — _Created comprehensive guide for Google Cloud setup including authentication and regional settings._
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
