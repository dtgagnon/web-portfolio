# Accessibility Test Refactoring Plan

## Overview

This document outlines a comprehensive plan to enhance the accessibility test coverage across the portfolio website. The goal is to ensure all components are thoroughly tested for accessibility compliance, focusing on WCAG 2.1 AA standards and providing a fully inclusive user experience.

## Current Status

After analyzing the current test suite, we've identified several gaps in accessibility test coverage:

1. **Inconsistent ARIA attribute testing**: Many components use ARIA attributes, but tests rarely verify their correct implementation.

2. **Limited keyboard navigation testing**: Interactive components lack tests for keyboard accessibility.

3. **Minimal focus management validation**: Components that manage focus (modals, dialogs) have insufficient tests for proper focus handling.

4. **Inconsistent alt text verification**: Image components aren't consistently tested for appropriate alt text.

5. **Missing semantic structure tests**: Tests should verify correct heading hierarchy and landmark regions.

## Testing Objectives

1. Add accessibility-specific test cases for all interactive components
2. Implement keyboard navigation testing for all interactive elements
3. Verify proper ARIA attributes across all relevant components
4. Ensure all images have appropriate alt text verification
5. Test focus management for modal dialogs and other focus-trapping components
6. Verify color contrast and text readability programmatically where possible
7. Maintain consistent test patterns for accessibility across the codebase

## Priority Components for Testing

### High Priority

- **Modal Components**
  - FullScreenModal.tsx
  - ResumeCard.tsx

- **Form Components**
  - Input.tsx
  - Button.tsx
  - ContactForm.tsx

- **Interactive UI Elements**
  - NavLink.tsx
  - ThemeToggle.tsx
  - SearchBar.tsx
  - ChatCard.tsx

### Medium Priority

- **Content Components**
  - Card.tsx
  - Hero.tsx
  - ResumeContent.tsx

- **Layout Components**
  - MainLayout.tsx
  - SectionLayout.tsx

### Lower Priority

- **Static Content Components**
  - Footer.tsx
  - About.tsx
  - icons/*.tsx

## Implementation Plan

### Phase 1: Establish Testing Utilities and Patterns

1. **Create Accessibility Testing Utilities**
   - Set up jest-axe for automated accessibility testing
   - Create helper functions for common accessibility tests
   - Establish patterns for keyboard navigation testing

2. **Document Testing Patterns**
   - Create reference documentation for accessibility testing
   - Define standards for different component types

### Phase 2: High-Priority Component Testing

#### Modal Components

1. **FullScreenModal.test.tsx**
   - Test focus trapping within modal
   - Verify ESC key closes modal
   - Test proper aria-modal and role attributes
   - Verify focus returns to trigger element when closed

2. **ResumeCard.test.tsx**
   - Test focus management within modal
   - Verify dialog role and aria-attributes
   - Test keyboard navigation for close button

#### Form Components

1. **Input.test.tsx**
   - Verify label association with input
   - Test aria-invalid state changes
   - Verify error messages are programmatically associated
   - Test for sufficient color contrast

2. **Button.test.tsx**
   - Test keyboard activation
   - Verify appropriate roles
   - Test disabled state announcements
   - Verify sufficient focus indicators

3. **ContactForm.test.tsx**
   - Test form submission via keyboard
   - Verify error announcements
   - Test focus movement during validation

#### Interactive UI Elements

1. **NavLink.test.tsx**
   - Test keyboard navigation
   - Verify active state is conveyed non-visually
   - Test for appropriate ARIA roles

2. **ThemeToggle.test.tsx**
   - Verify proper button role
   - Test keyboard activation
   - Verify state changes are announced

3. **SearchBar.test.tsx**
   - Test keyboard interaction
   - Verify ARIA attributes for search role
   - Test results announcement

4. **ChatCard.test.tsx**
   - Test keyboard opening/closing
   - Verify ARIA expanded states
   - Test focus management when opened/closed

### Phase 3: Medium-Priority Component Testing

#### Content Components

1. **Card.test.tsx**
   - Verify proper heading hierarchy
   - Test interactive elements within cards
   - Verify sufficient color contrast

2. **Hero.test.tsx**
   - Test heading structure
   - Verify image alt text
   - Test keyboard navigation for CTA buttons

3. **ResumeContent.test.tsx**
   - Verify document structure
   - Test reading order
   - Verify section landmarks

#### Layout Components

1. **MainLayout.test.tsx**
   - Test skip link functionality
   - Verify landmark regions
   - Test keyboard navigation between major sections

2. **SectionLayout.test.tsx**
   - Verify heading hierarchy
   - Test landmark roles

### Phase 4: Lower-Priority Component Testing

1. **Footer.test.tsx**
   - Verify links have accessible names
   - Test keyboard navigation

2. **About.test.tsx**
   - Verify content structure
   - Test reading order

3. **icons/*.test.tsx**
   - Verify proper aria-hidden attributes
   - Test for appropriate title elements

## Test Implementation Guidelines

### General Guidelines

1. **Use Explicit Queries**:
   ```tsx
   // Prefer
   screen.getByRole('button', { name: 'Submit' })
   
   // Over
   screen.getByText('Submit')
   ```

2. **Test Keyboard Interactions**:
   ```tsx
   fireEvent.keyDown(element, { key: 'Enter' })
   expect(mockFunction).toHaveBeenCalled()
   ```

3. **Verify ARIA Attributes**:
   ```tsx
   expect(element).toHaveAttribute('aria-expanded', 'true')
   ```

4. **Check Focus Management**:
   ```tsx
   fireEvent.click(openModalButton)
   expect(document.activeElement).toBe(closeModalButton)
   ```

### Component-Specific Patterns

#### Modal Testing Pattern

```tsx
it('manages focus correctly when opened', () => {
  render(<Modal />)
  const openButton = screen.getByRole('button', { name: 'Open Modal' })
  
  // Open modal
  fireEvent.click(openButton)
  
  // Focus should move to first focusable element or close button
  const closeButton = screen.getByRole('button', { name: 'Close' })
  expect(document.activeElement).toBe(closeButton)
  
  // Test focus trap
  fireEvent.tab()
  // Focus should stay within modal
  expect(document.activeElement).not.toBe(openButton)
  
  // Close modal
  fireEvent.keyDown(closeButton, { key: 'Escape' })
  
  // Focus should return to open button
  expect(document.activeElement).toBe(openButton)
})
```

#### Form Input Testing Pattern

```tsx
it('shows accessible validation errors', async () => {
  render(<Input required label="Email" />)
  const input = screen.getByLabelText('Email')
  
  // Trigger validation
  fireEvent.blur(input)
  
  // Verify accessible error state
  await waitFor(() => {
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAccessibleDescription(/required/i)
  })
})
```

## Validation Criteria

Accessibility tests are considered complete when they:

1. Verify keyboard accessibility for all interactive elements
2. Test proper ARIA attributes and roles
3. Verify focus management for complex widgets
4. Test screen reader announcements for state changes
5. Verify proper heading hierarchy and landmark regions
6. Test color contrast programmatically where possible

## Timeline

- **Week 1**: Complete Phase 1 (Establish testing utilities and patterns)
- **Week 2-3**: Complete Phase 2 (High-priority component testing)
- **Week 4-5**: Complete Phase 3 (Medium-priority component testing)
- **Week 6**: Complete Phase 4 (Lower-priority component testing)

## Resources

- WCAG 2.1 Guidelines: https://www.w3.org/TR/WCAG21/
- Testing Library Accessibility: https://testing-library.com/docs/dom-testing-library/api-accessibility/
- Jest-axe Documentation: https://github.com/nickcolley/jest-axe
- WAI-ARIA Practices: https://www.w3.org/TR/wai-aria-practices-1.2/

## Maintenance Plan

After implementing this accessibility test refactoring plan:

1. Include accessibility checks in the pull request template
2. Add jest-axe automated tests to the CI pipeline
3. Schedule quarterly accessibility audits to identify new issues
4. Maintain an accessibility testing pattern library for future reference
5. Provide training for developers on implementing accessibility tests
