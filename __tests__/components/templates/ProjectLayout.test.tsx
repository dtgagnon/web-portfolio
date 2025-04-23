import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProjectLayout from '@/components/templates/ProjectLayout';
import { ThemeProvider } from '@/providers/ThemeContext';

// Mock MainLayout to isolate testing of ProjectLayout
vi.mock('@/components/templates/MainLayout', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>,
}));

// Mock Button component
vi.mock('@/components/atoms', () => ({
  Button: ({ children, variant, onClick }: { children: React.ReactNode, variant: string, onClick?: () => void }) => (
    <button data-testid="button" data-variant={variant} onClick={onClick}>{children}</button>
  ),
}));

describe('ProjectLayout component', () => {
  // Functional Tests
  describe('Functionality', () => {
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
    const githubUrl = 'https://github.com/user/project';
    const demoUrl = 'https://demo.example.com';
    
    // Mock window.open
    const windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    
    render(
      <ThemeProvider>
        <ProjectLayout 
          title="Project Title" 
          github={githubUrl}
          demo={demoUrl}
        >
          <div>Project Content</div>
        </ProjectLayout>
      </ThemeProvider>
    );
    
    const buttons = screen.getAllByTestId('button');
    expect(buttons.length).toBe(2);
    expect(buttons[0]).toHaveTextContent('View Source');
    expect(buttons[1]).toHaveTextContent('Live Demo');
    
    // Test button clicks open correct URLs
    fireEvent.click(buttons[0]);
    expect(windowOpenSpy).toHaveBeenCalledWith(githubUrl, '_blank');
    
    fireEvent.click(buttons[1]);
    expect(windowOpenSpy).toHaveBeenCalledWith(demoUrl, '_blank');
    
    // Clean up mock
    windowOpenSpy.mockRestore();
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
    
    // Find the project content container
    const contentDiv = container.querySelector('.max-w-7xl.custom-class');
    expect(contentDiv).toBeInTheDocument();
  });
  
  it('does not render description when not provided', () => {
    const { container } = render(
      <ThemeProvider>
        <ProjectLayout title="Project Title">
          <div>Project Content</div>
        </ProjectLayout>
      </ThemeProvider>
    );
    
    // Description should not be rendered
    const descriptionElements = container.querySelectorAll('.text-xl.text-gray-500');
    expect(descriptionElements.length).toBe(0);
  });
  
  it('does not render technology tags when array is empty', () => {
    const { container } = render(
      <ThemeProvider>
        <ProjectLayout 
          title="Project Title"
          technologies={[]}
        >
          <div>Project Content</div>
        </ProjectLayout>
      </ThemeProvider>
    );
    
    // No technology tags should be rendered
    const techContainer = container.querySelector('.flex.flex-wrap.gap-2');
    expect(techContainer).not.toBeInTheDocument();
  });
  });
  
  // Visual Tests
  describe('Visual appearance', () => {
    it('maintains header styling and spacing', () => {
      const { container } = render(
        <ThemeProvider>
          <ProjectLayout title="Project Title">
            <p>Content</p>
          </ProjectLayout>
        </ThemeProvider>
      );
      
      // Find project header div (first section with background class)
      const headerDiv = container.querySelector('.bg-gray-50');
      expect(headerDiv).toHaveClass('dark:bg-gray-900');
      expect(headerDiv).toHaveClass('border-b');
      
      // Check container sizing and spacing
      const containerDivs = container.querySelectorAll('.max-w-7xl');
      expect(containerDivs.length).toBeGreaterThan(0);
      
      const headerContainer = containerDivs[0];
      expect(headerContainer).toHaveClass('py-12', 'md:py-16');
    });
    
    it('applies proper styling to technology tags', () => {
      const { container } = render(
        <ThemeProvider>
          <ProjectLayout 
            title="Project Title"
            technologies={['React', 'TypeScript']}
          >
            <p>Content</p>
          </ProjectLayout>
        </ThemeProvider>
      );
      
      const techTags = container.querySelectorAll('span');
      expect(techTags.length).toBe(2);
      
      techTags.forEach(tag => {
        expect(tag).toHaveClass('bg-gray-200', 'dark:bg-gray-700', 'rounded-full');
      });
    });
  });
});
