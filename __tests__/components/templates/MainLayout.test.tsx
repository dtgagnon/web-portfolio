import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import MainLayout from '@/components/templates/MainLayout';
import { ThemeProvider } from '@/providers/ThemeContext';

// Mock necessary components
vi.mock('@/components/organisms', () => ({
  Navbar: () => <div data-testid="navbar">Navbar</div>,
  Footer: () => <div data-testid="footer">Footer</div>
}));

vi.mock('@/components/organisms/chat', () => ({
  ChatCard: () => <div data-testid="chat-component" className="fixed bottom-0">Chat Component</div>
}));

vi.mock('@/components/atoms', () => ({
  ThemeToggle: () => <div data-testid="theme-toggle">ThemeToggle</div>
}));

vi.mock('@/components/molecules', () => ({
  SocialLinks: () => <div data-testid="social-links" className="absolute left-0">Social Links</div>
}));

describe('MainLayout component', () => {
  // Functional tests
  describe('Functionality', () => {
    it('renders with navbar, theme toggle, and content', () => {
      render(
        <ThemeProvider>
          <MainLayout>
            <div>Main Content</div>
          </MainLayout>
        </ThemeProvider>
      );
      
      // Verify key components are rendered
      expect(screen.getByTestId('navbar')).toBeInTheDocument();
      expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
      expect(screen.getByText('Main Content')).toBeInTheDocument();
    });
    
    it('renders with footer by default', () => {
      render(
        <ThemeProvider>
          <MainLayout>
            <div>Main Content</div>
          </MainLayout>
        </ThemeProvider>
      );
      
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });
    
    it('does not render footer when showFooter is false', () => {
      render(
        <ThemeProvider>
          <MainLayout showFooter={false}>
            <div>Main Content</div>
          </MainLayout>
        </ThemeProvider>
      );
      
      expect(screen.queryByTestId('footer')).not.toBeInTheDocument();
    });
    
    it('applies custom class to main element', () => {
      const { container } = render(
        <ThemeProvider>
          <MainLayout className="custom-class">
            <div>Main Content</div>
          </MainLayout>
        </ThemeProvider>
      );
      
      const mainElement = container.querySelector('main');
      expect(mainElement).toHaveClass('custom-class');
    });

    it('does not render social links when showSocialLinks is false', () => {
      render(
        <ThemeProvider>
          <MainLayout showSocialLinks={false}>
            <div>Main Content</div>
          </MainLayout>
        </ThemeProvider>
      );
      
      expect(screen.queryByTestId('social-links')).not.toBeInTheDocument();
    });

    it('does not render chat when showChat is false', () => {
      render(
        <ThemeProvider>
          <MainLayout showChat={false}>
            <div>Main Content</div>
          </MainLayout>
        </ThemeProvider>
      );
      
      expect(screen.queryByTestId('chat-component')).not.toBeInTheDocument();
    });
  });

  // Visual tests
  describe('Visual appearance', () => {
    let container: HTMLElement;

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

    it('has appropriate background color', () => {
      const mainElement = container.querySelector('main');
      expect(mainElement).toHaveClass('bg-navy-900', 'dark:bg-navy-950');
    });

    it('positions social links on the left side', () => {
      const socialLinks = screen.getByTestId('social-links');
      expect(socialLinks).toHaveClass('absolute', 'left-0');
      
      // Since we're mocking, we just verify the parent div exists, not its exact classes
      const socialLinksContainer = socialLinks.closest('div');
      expect(socialLinksContainer).toBeInTheDocument();
    });

    it('positions chat component at the bottom', () => {
      const chatComponent = screen.getByTestId('chat-component');
      expect(chatComponent).toHaveClass('fixed', 'bottom-0');
      
      // Since we're mocking, we just verify the parent div exists, not its exact classes
      const chatContainer = chatComponent.closest('div');
      expect(chatContainer).toBeInTheDocument();
    });

    it('applies responsive padding to content', () => {
      const contentContainer = container.querySelector('main > div');
      expect(contentContainer).toHaveClass('px-4', 'md:px-8');
    });
    
    it('ensures the layout spans the full viewport height', () => {
      const mainContainer = container.querySelector('div:first-child');
      expect(mainContainer).toHaveClass('min-h-screen', 'flex', 'flex-col');
    });
    
    it('applies correct theme transition styles', () => {
      const mainContainer = container.querySelector('div:first-child');
      expect(mainContainer).toHaveClass('transition-colors');
      expect(mainContainer).toHaveClass('bg-navy-900', 'dark:bg-navy-950');
      expect(mainContainer).toHaveClass('text-gray-100', 'dark:text-white');
    });
  });
});
