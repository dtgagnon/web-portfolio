---
trigger: always_on
---

# Rule – Test-Driven Development

1. **Write the failing test first** in `__tests__/…`, mirroring the code’s path.  
2. Write only the code required to make the test pass.  
3. Refactor while tests stay green.

- Every new logic or UI function must have at least one unit test before commit.  
- Preferred stack: **Vitest + React Testing Library** (Jest if Vitest is unavailable).

Activation Mode: Always On
