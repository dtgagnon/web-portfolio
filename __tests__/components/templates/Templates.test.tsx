import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ThemeProvider } from '@/providers/ThemeContext';
import { MainLayout, SectionLayout, ProjectLayout } from '@/components/templates';

// Mock chat components
vi.mock('@/components/organisms/chat', () => ({
  ChatCard: () => <div data-testid="chat-component" className="fixed bottom-0">Chat Component</div>
}));

// Mock child components to simplify testing
vi.mock('@/components/organisms', () => ({
  Navbar: () => <div data-testid="navbar">Navbar</div>,
  Footer: () => <div data-testid="footer">Footer</div>
}));

vi.mock('@/components/atoms', () => ({
  ThemeToggle: () => <div data-testid="theme-toggle">ThemeToggle</div>,
  Button: ({ children, variant, onClick }: { children: React.ReactNode, variant: string, onClick?: () => void }) => (
    <button data-testid="button" data-variant={variant} onClick={onClick}>{children}</button>
  ),
  IconLink: ({ href, label, children }: { href: string, label: string, children: React.ReactNode }) => (
    <a href={href} aria-label={label} data-testid="icon-link" className="inline-flex items-center justify-center">
      {children}
    </a>
  )
}));

describe('Template Components', () => {
  describe('SectionLayout', () => {
    it('renders the section with proper structure', () => {
      const { container } = render(
        <SectionLayout title="Test Title" subtitle="Test Subtitle">
          <p>Test Content</p>
        </SectionLayout>
      );
      
      // Verify section element exists with proper classes
      const section = container.querySelector('section');
      expect(section).toHaveClass('py-12', 'md:py-16');
      
      // Check container div exists
      const containerDiv = section?.querySelector('div');
      expect(containerDiv).toHaveClass('max-w-7xl', 'mx-auto');
      
      // Verify title and subtitle render correctly
      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
      
      // Verify content renders
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });
    
    it('applies proper classes based on props', () => {
      const { container } = render(
        <SectionLayout 
          title="Test Title" 
          centered={true} 
          containerSize="sm"
          className="test-class"
        >
          <p>Test Content</p>
        </SectionLayout>
      );
      
      // Verify section has custom class
      const section = container.querySelector('section');
      expect(section).toHaveClass('test-class');
      
      // Check container size
      const containerDiv = section?.querySelector('div');
      expect(containerDiv).toHaveClass('max-w-3xl'); // sm size
      
      // Check centered content
      const titleDiv = container.querySelector('div > div:first-child');
      expect(titleDiv).toHaveClass('text-center');
      
      const contentDiv = container.querySelector('div > div:last-child');
      expect(contentDiv).toHaveClass('flex', 'flex-col', 'items-center', 'text-center');
    });
    
    it('renders without container when withContainer is false', () => {
      const { container } = render(
        <SectionLayout withContainer={false}>
          <p>Test Content</p>
        </SectionLayout>
      );
      
      const containerDiv = container.querySelector('section > div');
      expect(containerDiv).not.toHaveClass('max-w-7xl');
      expect(containerDiv).not.toHaveClass('mx-auto');
    });
  });
  
  describe('MainLayout', () => {
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
  });
  
  describe('ProjectLayout', () => {
    it('renders project details correctly', () => {
      render(
        <ThemeProvider>
          <ProjectLayout 
            title="Project Title" 
            description="Project Description"
            technologies={['React', 'TypeScript']}
          >
            <div>Project Content</div>
          </ProjectLayout>
        </ThemeProvider>
      );
      
      // Check title and description
      expect(screen.getByText('Project Title')).toBeInTheDocument();
      expect(screen.getByText('Project Description')).toBeInTheDocument();
      
      // Check technologies
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
      
      // Check content
      expect(screen.getByText('Project Content')).toBeInTheDocument();
    });
    
    it('renders github and demo buttons when provided', () => {
      render(
        <ThemeProvider>
          <ProjectLayout 
            title="Project Title" 
            github="https://github.com/user/project"
            demo="https://demo.example.com"
          >
            <div>Project Content</div>
          </ProjectLayout>
        </ThemeProvider>
      );
      
      const buttons = screen.getAllByTestId('button');
      expect(buttons.length).toBe(2);
      expect(buttons[0]).toHaveTextContent('View Source');
      expect(buttons[1]).toHaveTextContent('Live Demo');
    });
    
    it('applies custom class to content area', () => {
      const { container } = render(
        <ThemeProvider>
          <ProjectLayout 
            title="Project Title" 
            className="custom-class"
          >
            <div>Project Content</div>
          </ProjectLayout>
        </ThemeProvider>
      );
      
      // Find project content div (second div with max-w-7xl class)
      const contentDivs = container.querySelectorAll('div.max-w-7xl');
      expect(contentDivs[1]).toHaveClass('custom-class');
    });
  });
});
