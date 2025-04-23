import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Projects from '@/components/pages/Projects';
import { MainLayout, SectionLayout } from '@/components/templates';
import { ThemeProvider } from '@/providers/ThemeContext';

// Mock Next.js Image component
vi.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, fill, style }: any) => (
    <img 
      src={src} 
      alt={alt} 
      style={style} 
      data-testid="next-image"
      data-fill={fill ? 'true' : 'false'}
    />
  )
}));

// Mock the templates
vi.mock('@/components/templates', () => ({
  MainLayout: vi.fn(({ children }) => <div data-testid="main-layout">{children}</div>),
  SectionLayout: vi.fn(({ children, title, subtitle, className }) => (
    <div data-testid="section-layout" className={className || ''}>
      <h1>{title}</h1>
      <p>{subtitle}</p>
      {children}
    </div>
  ))
}));

// Mock Card component
vi.mock('@/components/molecules', () => ({
  Card: ({ children, hoverable, className, onClick }: any) => (
    <div 
      data-testid="project-card" 
      data-hoverable={hoverable ? 'true' : 'false'}
      className={className || ''}
      onClick={onClick}
    >
      {children}
    </div>
  )
}));

describe('Projects Page Component', () => {
  let container: HTMLElement;

  beforeEach(() => {
    const renderResult = render(
      <ThemeProvider>
        <Projects />
      </ThemeProvider>
    );
    container = renderResult.container;
  });

  it('renders the projects page with proper structure', () => {
    // Check for main containers
    expect(screen.getByTestId('main-layout')).toBeInTheDocument();
    expect(screen.getByTestId('section-layout')).toBeInTheDocument();
    
    // Check for title and subtitle
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText(/Explore my work in medical technology/)).toBeInTheDocument();
  });

  it('displays all category filter buttons', () => {
    // Check for category filters by targeting the container first
    const filterContainer = screen.getByTestId('section-layout')
      .querySelector('.flex.flex-wrap.gap-2.mb-12');
    expect(filterContainer).toBeInTheDocument();
    
    // Check that all category buttons exist
    const categories = ['All', 'Medical Devices', 'Inclusive Design', 'AI/ML', 'IoT'];
    categories.forEach(category => {
      const buttonWithText = Array.from(filterContainer?.querySelectorAll('button') || [])
        .find(button => button.textContent === category);
      expect(buttonWithText).toBeInTheDocument();
    });
    
    // All should be active by default
    const allButton = Array.from(filterContainer?.querySelectorAll('button') || [])
      .find(button => button.textContent === 'All');
    expect(allButton?.className).toContain('bg-[#7cbddb]');
  });

  it('renders project cards with correct content', () => {
    // Check for project cards
    const projectCards = screen.getAllByTestId('project-card');
    expect(projectCards.length).toBeGreaterThan(0);
    
    // Check for specific project titles
    expect(screen.getByText('NeuroAssist')).toBeInTheDocument();
    expect(screen.getByText('MindfulTech Framework')).toBeInTheDocument();
    expect(screen.getByText('SenseNet')).toBeInTheDocument();
    
    // Check for images
    const images = screen.getAllByTestId('next-image');
    expect(images.length).toBe(projectCards.length);
  });

  it('filters projects when category is clicked', () => {
    // Initial state should show all projects
    let projectCards = screen.getAllByTestId('project-card');
    const initialCount = projectCards.length;
    expect(initialCount).toBeGreaterThan(3); // Should have more than 3 projects initially
    
    // Get the filter container and find the AI/ML button
    const filterContainer = screen.getByTestId('section-layout')
      .querySelector('.flex.flex-wrap.gap-2.mb-12');
    const aiMlButton = Array.from(filterContainer?.querySelectorAll('button') || [])
      .find(button => button.textContent === 'AI/ML');
    expect(aiMlButton).toBeInTheDocument();
    
    // Click on AI/ML category
    fireEvent.click(aiMlButton as HTMLElement);
    
    // Now only AI/ML projects should be visible
    projectCards = screen.getAllByTestId('project-card');
    expect(projectCards.length).toBeLessThan(initialCount);
    
    // There should still be some projects visible
    expect(projectCards.length).toBeGreaterThan(0);
  });

  it('shows technology tags for each project', () => {
    // Check for technology tags
    expect(screen.getByText('Machine Learning')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Python')).toBeInTheDocument();
    
    // Check for additional tags indicator
    const moreTags = screen.getAllByText(/\+\d more/);
    expect(moreTags.length).toBeGreaterThan(0);
  });

  it('has responsive grid layout', () => {
    // Check for grid container
    const gridContainer = screen.getByTestId('section-layout')
      .querySelector('.grid');
    
    expect(gridContainer).toHaveClass(
      'grid-cols-1', 
      'md:grid-cols-2', 
      'lg:grid-cols-3', 
      'gap-8'
    );
  });
});
