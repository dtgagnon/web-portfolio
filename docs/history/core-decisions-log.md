# Core Decisions Log

This document serves as the central record of all key architectural and technical decisions made throughout the development of this project. Each entry captures the context, reasoning, and implications of important choices that shaped the application.

---

## Decision 001: Gemini Chat User ID and Session Management Strategy

### Date: June 3, 2025

### Context
The chat application was encountering persistent foreign key constraint failures (`SqliteError: FOREIGN KEY constraint failed`) when attempting to create chat sessions linked to users. This occurred because the client was sending randomly generated or fallback-based `userId` values that were not guaranteed to exist in the database `users` table.

### Problem
1. Client-side code generates random `userId` values or uses fallbacks for persistence
2. Server-side `UserRepository.create` internally generates UUIDs and does not accept custom user IDs
3. Session creation in `SessionRepository` requires existing user IDs to satisfy foreign key constraints
4. Previous attempts to fix this referenced undefined variables and incorrectly tried to create users with explicit IDs

### Solution
Implemented a dual-ID approach that maintains both client identity and database integrity:

1. **User Lookup and Creation Flow**
   - First attempt to find user by client-provided ID
   - If not found, check by deterministic email derived from client ID (`chat-user-${userId}@chat.example.com`)
   - If still not found, create new user record with the deterministic email
   - Use database-generated `user.id` for all subsequent database operations

2. **Session Management**
   - Create or verify sessions using only database-generated user IDs
   - Ensure all foreign key constraints are satisfied

3. **Message Storage**
   - Store both user and assistant messages with the database user ID
   - Maintain consistent database relationships

4. **Code Structure**
   - Restructured the API route handler to use a dedicated async function for user/session setup
   - Improved variable scoping to prevent TypeScript errors
   - Added comprehensive error handling and logging

### Benefits
- Maintains database referential integrity
- Preserves the client-side user experience with persistent identity
- Eliminates previously common database errors
- Provides detailed logging for future maintenance

### Alternatives Considered
- Direct modification of UserRepository to accept custom IDs (rejected: would require schema changes)
- Client-side retrieval of valid user IDs before chat (rejected: adds complexity and latency)
- Removing foreign key constraints (rejected: would sacrifice data integrity)

### Future Considerations
- Implement proper user authentication instead of fallback ID mechanism
- Add comprehensive testing for the user/session creation flow
- Review performance implications of additional user lookups

---

<!-- Template for future decisions -->
<!--
## Decision XXX: [Title]

### Date: [Date]

### Context
[Background and situation leading to this decision]

### Problem
[Specific issues being addressed]

### Solution
[Details of the approach taken]

### Benefits
[Advantages of this solution]

### Alternatives Considered
[Other options and why they weren't chosen]

### Future Considerations
[Potential follow-ups or related work]
-->
