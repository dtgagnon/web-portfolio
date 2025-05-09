# Main Page Layout Development Plan

## Overview
This plan outlines the reimplementation of the main page content layout following the atomic design principles established in the atomic design refactor. The goal is to preserve the existing layout aesthetic while leveraging the new component structure. The focus remains on a clean, minimal design that fits within the viewport without scrolling.

## Detailed Layout Analysis

Based on the previous portfolio layout, we observed the following key elements:

1. **Overall Structure**:
   - Dark-themed design with a navy/dark blue background
   - Minimalist approach with significant negative space
   - Vertically centered content with primary focus on the profile information
   - Full viewport design with no apparent scrolling needed

2. **Header Elements**:
   - Logo positioned in the top-left corner (white square with icon)
   - Navigation links ("About", "Projects", "Resume") aligned to the top-right
   - Theme toggle button in far top-right (moon icon/sun icon, theme dependent)
   - Test banner across the top (Tailwind dark mode test)

3. **Main Content**:
   - Centered circular profile photo
   - Name "Derek Gagnon" displayed prominently to the left of the photo
   - Email address below the name
   - Brief bio text aligned to the right of the photo
   - Content appears to use a grid or flex layout with asymmetrical balance

4. **Social Elements**:
   - Social media icons (LinkedIn, GitHub) positioned to the left of the main content
   - Icons are appropriately sized (appear to match the 1.25rem specification)

5. **Footer/Additional Elements**:
   - "Chat with Me" button peeking from the bottom center of the screen
   - Appears to be an expandable component with a subtle blue background

6. **Technical Approach**:
   - Likely using Flexbox or Grid CSS for the overall layout
   - Absolute positioning possibly used for the chat component
   - Fixed header with flex justification for navigation elements
   - Main content appears to use either grid layout or flex with specific alignment

## Objectives
- Implement responsive main page layout that matches the previous design
- Ensure content fits within viewport without unnecessary scrolling
- Maintain clean, minimal design aesthetic
- Implement the layout using the new atomic design component structure
- Follow test-driven development approach

## Implementation Steps (Test-Driven Development Approach)

### 1. Write Tests (Day 1)
- Create unit tests for MainLayout component using the visual regression testing approach
  - Test for correct component rendering
  - Test for proper positioning of elements
  - Test for responsive behavior
- Create unit tests for header navigation with correct item positioning
- Create unit tests for profile section with proper alignment of photo, name, and bio
- Create unit tests for social links with correct positioning and sizing
- Create unit tests for chat component with correct positioning at bottom

### 2. Implement MainLayout Component (Day 1-2)
- Create minimal implementation of MainLayout to pass tests
- Ensure full-viewport coverage with dark theme background
- Validate responsive behavior across different screen sizes

### 3. Implement Header Components (Day 2)
- Implement Logo component positioning in top-left
- Implement Navigation component with links aligned to top-right
- Implement ThemeToggle component in the far top-right

### 4. Implement Profile Section (Day 2-3)
- Create circular profile photo component
- Implement name and email components with correct alignment
- Implement bio text component aligned to the right of photo
- Ensure proper spacing and proportions match the original design

### 5. Implement Social Links (Day 3)
- Position social media icons to the left of main content
- Ensure icons are sized at 1.25rem as per specifications
- Implement proper hover states and accessibility features

### 6. Implement Chat Component (Day 3)
- Configure the chat component to peek from the bottom rather than take full screen
- Implement proper z-indexing and positioning
- Ensure expandable behavior works correctly

### 7. Final Styling and Refinements (Day 4)
- Apply consistent styling across all components
- Implement any remaining animations/transitions
- Ensure proper SVG size constraints
- Fine-tune spacing and alignment to match original design

## Testing Strategy

1. **Unit Tests**:
   - Component rendering tests
   - Prop validation tests
   - Event handling tests

2. **Visual Regression Tests**:
   - Snapshot comparisons with expected layout
   - Component positioning verification
   - Responsive behavior testing at various breakpoints

3. **Integration Tests**:
   - Component interaction tests
   - Theme switching functionality
   - Navigation functionality

4. **Accessibility Tests**:
   - Keyboard navigation
   - Screen reader compatibility
   - Color contrast validation

## Test Implementation Details

```typescript
// Example test structure for MainLayout
describe('MainLayout', () => {
  it('renders with correct structure', () => {
    // Test full layout rendering
  });

  it('positions logo in top-left corner', () => {
    // Test logo positioning
  });

  it('positions navigation in top-right corner', () => {
    // Test navigation positioning
  });

  it('centers profile content vertically', () => {
    // Test main content vertical alignment
  });

  it('positions social links correctly', () => {
    // Test social links positioning
  });

  it('positions chat component at bottom', () => {
    // Test chat component positioning
  });

  it('maintains responsive layout at various breakpoints', () => {
    // Test responsive behavior
  });
});
```

## Success Criteria
- All unit and visual regression tests pass
- Layout visually matches the original design
- Main content fits within viewport without requiring scroll on standard viewports
- Clean, minimal design aesthetic is maintained
- All components are properly aligned and spaced
- SVG elements maintain appropriate size constraints
- Social media icons are sized at 1.25rem
- Chat component peeks from bottom rather than taking full screen
- Layout is responsive and maintains proper appearance across device sizes

## Timeline
- Test writing and implementation planning: 1 day
- Component implementation (minimal code to pass tests): 2 days
- Style refinements and responsive adjustments: 1 day
- Final testing and bug fixes: 1 day
