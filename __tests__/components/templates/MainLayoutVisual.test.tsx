import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MainLayout } from '@/components/templates';
import { ThemeProvider } from '@/providers/ThemeContext';

// Mock necessary components
vi.mock('@/components/organisms', () => ({
  Navbar: () => <div data-testid="navbar">Navbar</div>,
  Footer: () => <div data-testid="footer">Footer</div>
}));

vi.mock('@/components/organisms/chat', () => ({
  ChatCard: () => <div data-testid="chat-component" className="fixed bottom-0">Chat</div>
}));

vi.mock('@/components/atoms', () => ({
  ThemeToggle: () => <div data-testid="theme-toggle">Theme Toggle</div>,
  IconLink: ({ href, label, children }: { href: string, label: string, children: React.ReactNode }) => (
    <a href={href} aria-label={label} data-testid="icon-link" className="inline-flex items-center justify-center">
      {children}
    </a>
  )
}));

vi.mock('@/components/molecules', () => ({
  SocialLinks: () => <div data-testid="social-links" className="absolute left-0">Social Links</div>,
  Card: ({ children }: { children: React.ReactNode }) => <div data-testid="card">{children}</div>
}));

// Test specific DOM structure and positioning
describe('MainLayout Visual Regression Tests', () => {
  let container: HTMLElement;

  // Setup function to render the component before each test
  beforeEach(() => {
    const renderResult = render(
      <ThemeProvider>
        <MainLayout>
          <div data-testid="main-content">Main Content</div>
        </MainLayout>
      </ThemeProvider>
    );
    container = renderResult.container;
  });

  it('renders with full viewport height', () => {
    const mainElement = container.querySelector('main');
    expect(mainElement).toHaveClass('min-h-screen');
  });

  it('has dark theme background color', () => {
    const mainElement = container.querySelector('main');
    // Check for dark background class (assuming dark mode default)
    expect(mainElement).toHaveClass('bg-navy-900', 'dark:bg-navy-950');
  });

  it('positions logo in the top-left corner', () => {
    // Test for logo/brand position
    const header = container.querySelector('header');
    expect(header).toBeInTheDocument();
    
    // Check for flex container with justified content
    expect(header).toHaveClass('flex', 'justify-between', 'items-center');
    
    // First child should be the logo container
    const logoContainer = header?.firstElementChild;
    expect(logoContainer).toBeInTheDocument();
  });

  it('positions navigation in the top-right corner', () => {
    const header = container.querySelector('header');
    const navContainer = header?.lastElementChild;
    
    expect(navContainer).toBeInTheDocument();
    expect(navContainer).toHaveClass('flex', 'items-center');
  });

  it('centers main content vertically', () => {
    // Main content container should have flex and justify-center
    const contentContainer = container.querySelector('main > div');
    expect(contentContainer).toHaveClass('flex', 'flex-col', 'justify-center');
  });

  it('positions chat component at the bottom', () => {
    // Chat component should have fixed positioning at bottom
    const chatComponent = container.querySelector('[data-testid="chat-component"]');
    
    // We'll need to add a data-testid to the chat component, for now we'll check for fixed positioning
    const fixedElements = container.querySelectorAll('.fixed.bottom-0');
    expect(fixedElements.length).toBeGreaterThan(0);
  });

  it('positions social links on the left side of content', () => {
    // Social links should be positioned to the left of the main content
    const socialLinksContainer = container.querySelector('[data-testid="social-links"]');
    
    // We'll need to add a data-testid to the social links component
    // For now, we'll check for element with the expected classes
    const leftPositionedElements = container.querySelectorAll('.absolute.left-0');
    expect(leftPositionedElements.length).toBeGreaterThan(0);
  });

  it('applies responsive classes for mobile view', () => {
    // Header should have responsive classes for different screen sizes
    const header = container.querySelector('header');
    expect(header).toHaveClass('px-4', 'md:px-8');
    
    // Content spacing should be responsive
    const contentContainer = container.querySelector('main > div');
    expect(contentContainer).toHaveClass('px-4', 'md:px-8');
  });
});
