# Development Plan: Responsive Main Page Layout (TDD)

**Overall Goal:**
Refactor the main page to display a distinct "mobile layout" for screens narrower than 860px and retain the current "desktop layout" for screens 860px and wider.

**Mobile Layout Structure (Screens < 860px):**
1.  Name: "Derek Gagnon" (centered)
2.  Profile Image (centered)
3.  About Me Blurb (centered, including "More about me ->" link)
4.  Single Dotted Border (centered, full width relative to content stack)
5.  Social Links (centered)

---

## Phase 1: Test Setup and Writing Tests

*   **Objective:** Create comprehensive tests for both mobile and desktop layouts *before* writing implementation code.
*   **Files Involved:**
    *   `__tests__/HomePage.test.tsx` (or similar, for `app/page.tsx`)
    *   Potentially `__tests__/ContactInfo.test.tsx` if we need to test conditional email visibility at a unit level.
*   **Key Tooling:**
    *   `@testing-library/react`
    *   `@testing-library/jest-dom`
    *   Jest's mocking capabilities (especially for `window.matchMedia`).

### Step 1.1: Set up `window.matchMedia` Mock
Create a robust mock for `window.matchMedia` that allows us to control the perceived screen width in tests. This is crucial for testing responsive designs.

```javascript
// __tests__/setupTests.ts or directly in HomePage.test.tsx
export const mockMatchMedia = (matches: boolean) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches, // False for desktop, true for mobile in our case based on (max-width: 859px)
      media: query,
      onchange: null,
      addListener: jest.fn(), // Deprecated
      removeListener: jest.fn(), // Deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
};
```

### Step 1.2: Write Tests for Mobile Layout (`__tests__/HomePage.test.tsx`)

*   **Test Suite: `describe('Home Page - Mobile Layout (screen < 860px)', () => { ... });`**
    *   `beforeEach(() => { mockMatchMedia(true); });` (simulates mobile width)
    *   **Test 1.2.1: Renders all core components:**
        *   Assert `ContactInfo` (with name), `Image` (profile), `AboutMeBlurb`, `SocialLinks` are present.
    *   **Test 1.2.2: Correct order and structure:**
        *   Query elements and check their relative order in the DOM or using accessible roles if possible. This is the trickiest part for unit tests. We might add `data-testid` attributes to key layout sections to help with ordering assertions.
        *   Example: `data-testid="mobile-layout-name"`, `data-testid="mobile-layout-image"`, etc.
    *   **Test 1.2.3: `ContactInfo` displays only name and is centered:**
        *   Verify "Derek Gagnon" is visible.
        *   Verify email is *not* visible.
        *   Check for centering classes (e.g., `text-center` on the relevant wrapper).
    *   **Test 1.2.4: Profile image is rendered and centered.**
    *   **Test 1.2.5: `AboutMeBlurb` is rendered, text content visible, and centered.**
    *   **Test 1.2.6: Single dotted border is present between `AboutMeBlurb` and `SocialLinks`.**
        *   Look for an element with classes like `border-b border-dotted`.
    *   **Test 1.2.7: `SocialLinks` are rendered and centered.**

### Step 1.3: Write Tests for Desktop Layout (`__tests__/HomePage.test.tsx`)

*   **Test Suite: `describe('Home Page - Desktop Layout (screen >= 860px)', () => { ... });`**
    *   `beforeEach(() => { mockMatchMedia(false); });` (simulates desktop width)
    *   **Test 1.3.1: Renders all core components.**
    *   **Test 1.3.2: Correct three-column structure:**
        *   Verify Contact/Social appear before Image, and Image before AboutMe in the DOM if a flat structure is used with CSS ordering.
        *   More robustly, test for the presence of the wrapper `divs` that create the columns and their content.
    *   **Test 1.3.3: `ContactInfo` displays name and email.**
    *   **Test 1.3.4: Artistic vertical offsets are applied:**
        *   Check for `transform` and `translate-y-*` classes on the left and right column wrappers.
    *   **Test 1.3.5: Original two dotted borders are present (and mobile single border is hidden).**

---

## Phase 2: Implementation (Make Tests Pass)

*   **Objective:** Implement the logic and components required to pass the tests defined in Phase 1.

### Step 2.1: Create a Breakpoint Hook (`useBreakpoint.ts`)** (Recommended)
A custom hook to manage screen size detection.

```typescript
// lib/hooks/useBreakpoint.ts
import { useState, useEffect } from 'react';

const useBreakpoint = (breakpoint: number) => {
  const [isBelowBreakpoint, setIsBelowBreakpoint] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${breakpoint -1}px)`);
    const handleResize = () => setIsBelowBreakpoint(mediaQuery.matches);
    
    handleResize(); // Initial check
    mediaQuery.addEventListener('change', handleResize);
    return () => mediaQuery.removeEventListener('change', handleResize);
  }, [breakpoint]);

  return isBelowBreakpoint;
};

export default useBreakpoint;
```

### Step 2.2: Refactor `app/page.tsx` (`Home` Component)

*   Import and use `useBreakpoint(860)`.
*   Employ conditional rendering:
    *   If `isMobile` is true, render a structure for the mobile layout.
    *   Else, render the current desktop layout structure.
*   This might involve creating two new components:
    *   `MobileMainContent.tsx`
    *   `DesktopMainContent.tsx`
    *   Both would receive necessary data (name, email, image src, components like `AboutMeBlurb`, `SocialLinks`) as props.
    *   The `Home` component in `app/page.tsx` would then look like:
        ```tsx
        // app/page.tsx
        // ... imports ...
        import useBreakpoint from '@/lib/hooks/useBreakpoint';
        import MobileMainContent from '@/components/layouts/MobileMainContent'; // Or similar
        import DesktopMainContent from '@/components/layouts/DesktopMainContent'; // Or similar

        export default function Home() {
          const isMobile = useBreakpoint(860);
          
          // ... (Header and Footer can remain common outside of Mobile/DesktopMainContent)
          return (
            <div className="grid grid-rows-[auto_1fr_auto] min-h-screen max-w-[1920px] mx-auto gap-6 p-4 pt-20 font-[family-name:var(--font-geist-sans)]">
              {/* Header */}
              <main className="flex items-center justify-center">
                {isMobile ? <MobileMainContent /> : <DesktopMainContent />}
              </main>
              {/* Footer */}
            </div>
          );
        }
        ```

### Step 2.3: Implement `MobileMainContent.tsx`

*   This component will arrange `ContactInfo`, `Image`, `AboutMeBlurb`, the new dotted border, and `SocialLinks` vertically.
*   It will apply centering styles (`items-center`, `text-center` where appropriate).
*   It will pass a prop to `ContactInfo` to hide the email (e.g., `showEmail={false}`).
*   Example structure:
    ```tsx
    // components/layouts/MobileMainContent.tsx
    // ... imports for ContactInfo, Image, AboutMeBlurb, SocialLinks ...
    export default function MobileMainContent() {
      return (
        <div className="flex flex-col items-center space-y-6 w-full px-4">
          <ContactInfo name="Derek Gagnon" email="" showEmail={false} className="text-center" />
          <Image /* ...profile image props... */ />
          <AboutMeBlurb className="text-center" />
          <div className="w-full max-w-sm border-b border-dotted border-gray-400 my-4" />
          <SocialLinks />
        </div>
      );
    }
    ```

### Step 2.4: Implement `DesktopMainContent.tsx`

*   This component will largely encapsulate the *current* `<main>` content structure from `app/page.tsx` (the three-column layout with artistic offsets).
*   It will ensure `ContactInfo` receives `showEmail={true}` (or defaults to showing it).

### Step 2.5: Modify `ContactInfo.tsx` (if necessary)

*   Add a prop like `showEmail?: boolean` (defaulting to true).
*   Conditionally render the email paragraph based on this prop.

```tsx
// components/molecules/ContactInfo.tsx
// ...
// {showEmail && <p className="text-sm text-gray-500 dark:text-gray-400">{email}</p>}
// ...
```

---

## Phase 3: Run Tests and Iterate

*   Run all tests. They should initially fail for the implementation parts.
*   Implement the components and logic as outlined in Phase 2.
*   Re-run tests iteratively until all pass.
*   Perform manual browser testing at various widths to confirm visual correctness and behavior.

---

## Next Steps (from plan):

1.  Start by creating/updating `__tests__/setupTests.ts` with the `mockMatchMedia` function.
2.  Then, begin writing the test cases in `__tests__/HomePage.test.tsx` for the mobile layout.
