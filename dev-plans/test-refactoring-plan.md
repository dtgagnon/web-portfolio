# Test Refactoring Plan

## Overview

This document outlines a comprehensive plan to improve test coverage across the portfolio website project. The goal is to ensure every component has dedicated test files that thoroughly validate their functionality, props handling, accessibility, and visual appearance where appropriate.

## Current Status

After analyzing the current test suite, we've identified several gaps in test coverage:

1. **Components with indirect tests only**: Many components are mocked and indirectly tested in integration tests but lack dedicated unit tests.

2. **Components with no tests**: Several components have no test coverage at all, particularly in the chat and resume subdirectories.

3. **Components with tests bundled together**: Some template components have tests bundled in shared test files instead of dedicated ones.

## Testing Objectives

1. Break out tests for components currently tested in bundled files
2. Create dedicated tests for components with indirect tests only
3. Implement comprehensive tests for components with no test coverage
4. Maintain consistent test patterns and naming conventions
5. Ensure all tests follow the project's established practices

## Component Testing Status

### Components with Dedicated Tests

- ✅ atoms/Button.tsx
- ✅ atoms/ThemeToggle.tsx
- ✅ molecules/AboutMeBlurb.tsx
- ✅ molecules/FullScreenModal.tsx
- ✅ organisms/About.tsx
- ✅ organisms/Navbar.tsx
- ✅ pages/Home.tsx

### Components with Tests to Break Out

- ⚠️ templates/MainLayout.tsx (Currently in Templates.test.tsx and MainLayoutVisual.test.tsx)
- ⚠️ templates/SectionLayout.tsx (Currently in Templates.test.tsx and VisualRegression.test.tsx)
- ⚠️ templates/ProjectLayout.tsx (Currently in Templates.test.tsx and VisualRegression.test.tsx)

### Components with Indirect Tests Only

- ⚠️ atoms/Logo.tsx (Mocked in Navbar.test.tsx)
- ⚠️ atoms/IconLink.tsx (Mocked in MainLayoutVisual.test.tsx)
- ⚠️ atoms/Input.tsx (Mocked in Home.test.tsx)
- ⚠️ molecules/Card.tsx (Mocked in About.test.tsx and Home.test.tsx)
- ⚠️ molecules/ContactInfo.tsx (Mocked in Home.test.tsx)
- ⚠️ molecules/NavLink.tsx (Mocked in Navbar.test.tsx and Home.test.tsx)
- ⚠️ molecules/SearchBar.tsx (Mocked in Home.test.tsx)
- ⚠️ molecules/SocialLinks.tsx (Mocked in Navbar.test.tsx, Home.test.tsx, and MainLayoutVisual.test.tsx)
- ⚠️ organisms/ContactForm.tsx (Mocked in Home.test.tsx)
- ⚠️ organisms/Footer.tsx (Mocked in MainLayoutVisual.test.tsx)
- ⚠️ organisms/Hero.tsx (Mocked in Home.test.tsx)
- ⚠️ organisms/chat/ChatCard.tsx (Mocked in MainLayoutVisual.test.tsx and Home.test.tsx)

### Components with No Tests

- ❌ atoms/icons/index.tsx
- ❌ organisms/chat/InputField.tsx
- ❌ organisms/chat/MessageBubble.tsx
- ❌ organisms/resume/ResumeCard.tsx
- ❌ organisms/resume/ResumeContent.tsx
- ❌ pages/Contact.tsx
- ❌ pages/Projects.tsx
- ❌ pages/Resume.tsx
- ❌ templates/BlogLayout.tsx

## Implementation Plan

### Phase 1: Break Out Tests from Bundled Files

1. **MainLayout.test.tsx**
   - Extract MainLayout tests from Templates.test.tsx
   - Combine with relevant tests from MainLayoutVisual.test.tsx
   - Ensure comprehensive testing of props, rendering, and functionality

2. **SectionLayout.test.tsx**
   - Extract SectionLayout tests from Templates.test.tsx
   - Add any missing test cases for props and variations

3. **ProjectLayout.test.tsx**
   - Extract ProjectLayout tests from Templates.test.tsx
   - Add any missing test cases for props and variations

### Phase 2: Create Tests for Indirectly Tested Components

#### Atomic Components

1. **Logo.test.tsx**
   - Test rendering with and without text
   - Test link functionality
   - Test accessibility (aria attributes)

2. **IconLink.test.tsx**
   - Test link functionality
   - Test icon rendering
   - Test accessibility attributes

3. **Input.test.tsx**
   - Test onChange functionality
   - Test label rendering
   - Test validation states
   - Test accessibility

4. **icons/index.test.tsx**
   - Test each icon component rendering
   - Test customization via props

#### Molecular Components

1. **Card.test.tsx**
   - Test rendering with different content
   - Test variants and styling props
   - Test accessibility

2. **ContactInfo.test.tsx**
   - Test all contact information rendering
   - Test links and interactions

3. **NavLink.test.tsx**
   - Test active state handling
   - Test link functionality
   - Test styling variations

4. **SearchBar.test.tsx**
   - Test input functionality
   - Test search submission
   - Test result rendering

5. **SocialLinks.test.tsx**
   - Test rendering of all social links
   - Test custom direction props
   - Test icon sizing

#### Organism Components

1. **ContactForm.test.tsx**
   - Test form submission
   - Test validation
   - Test error states
   - Test success feedback

2. **Footer.test.tsx**
   - Test links and navigation
   - Test copyright information
   - Test responsive layout

3. **Hero.test.tsx**
   - Test headline and subheadline
   - Test call-to-action buttons
   - Test responsive layout

4. **chat/ChatCard.test.tsx**
   - Test open/close functionality
   - Test message rendering
   - Test user interaction

### Phase 3: Create Tests for Components with No Coverage

1. **chat/InputField.test.tsx**
   - Test input functionality
   - Test submission
   - Test validation

2. **chat/MessageBubble.test.tsx**
   - Test different message types
   - Test timestamp formatting
   - Test styling variations

3. **resume/ResumeCard.test.tsx**
   - Test content rendering
   - Test styling variations

4. **resume/ResumeContent.test.tsx**
   - Test sections rendering
   - Test responsive layout

5. **pages/Contact.test.tsx**
   - Test form integration
   - Test page layout

6. **pages/Projects.test.tsx**
   - Test project cards rendering
   - Test filtering functionality

7. **pages/Resume.test.tsx**
   - Test sections rendering
   - Test download functionality

8. **templates/BlogLayout.test.tsx**
   - Test with different content
   - Test metadata handling
   - Test navigation elements

## Test Structure Guidelines

All test files should follow this consistent structure:

1. **Import and setup**
   - Import component and testing utilities
   - Mock dependencies when necessary

2. **Basic rendering tests**
   - Verify component renders without errors
   - Check that key elements are present

3. **Props and customization tests**
   - Test different prop combinations
   - Verify class names and styling based on props

4. **Interaction tests**
   - Test user interactions (clicks, inputs, etc.)
   - Verify state changes in response to interactions

5. **Integration tests**
   - Test component in context with related components
   - Verify correct behavior in typical usage scenarios

6. **Accessibility tests**
   - Test keyboard navigation
   - Verify appropriate ARIA attributes
   - Check for proper heading hierarchy

7. **Visual regression tests** (where appropriate)
   - Test layout and styling on different screen sizes
   - Verify design system compliance

## Testing Standards

1. Use `describe` blocks to group related tests
2. Use meaningful test descriptions that explain what is being tested
3. Follow the "Arrange-Act-Assert" pattern
4. Mock complex dependencies to isolate component behavior
5. Test edge cases and error scenarios
6. Ensure tests are idempotent (can be run multiple times with the same result)
7. Follow the project's 2-space indentation standard

## Validation Criteria

A component test suite is considered complete when it:

1. Tests all props and their variations
2. Tests all user interactions
3. Tests all conditional rendering scenarios
4. Tests accessibility features
5. Tests error handling
6. Achieves high code coverage (aim for >80%)
7. Follows all project testing standards

## Timeline

- **Week 1**: Complete Phase 1 (Break out tests from bundled files)
- **Week 2-3**: Complete Phase 2 (Create tests for indirectly tested components)
- **Week 4-5**: Complete Phase 3 (Create tests for components with no coverage)

## Resources

- React Testing Library documentation: https://testing-library.com/docs/react-testing-library/intro
- Vitest documentation: https://vitest.dev/api/
- Testing best practices: https://kentcdodds.com/blog/common-mistakes-with-react-testing-library

## Maintenance Plan

After implementing this test refactoring plan:

1. Add test coverage reporting to CI pipeline
2. Establish a rule that all new components must have dedicated tests
3. Schedule quarterly test maintenance to update tests as components evolve
4. Document testing patterns in a project wiki for future reference
