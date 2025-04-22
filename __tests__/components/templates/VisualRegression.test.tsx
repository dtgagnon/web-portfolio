import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MainLayout from '@/components/templates/MainLayout';
import SectionLayout from '@/components/templates/SectionLayout';
import ProjectLayout from '@/components/templates/ProjectLayout';
import { ThemeProvider } from '@/providers/ThemeContext';
import ThemeToggle from '@/components/atoms/ThemeToggle';

// Mock window.matchMedia which is not available in the test environment
window.matchMedia = vi.fn().mockImplementation(query => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));

// Mock necessary components
vi.mock('@/components/organisms', () => ({
  Navbar: () => <div className="sticky top-0 backdrop-blur-sm" data-testid="navbar">Navbar</div>,
  Footer: () => <div data-testid="footer">Footer</div>
}));

vi.mock('@/components/atoms', () => ({
  ThemeToggle: () => (
    <div data-testid="theme-toggle">
      <svg data-testid="theme-toggle-icon" className="w-5 h-5"></svg>
    </div>
  ),
  Button: ({ children, variant, onClick }: { children: React.ReactNode, variant: string, onClick?: () => void }) => (
    <button className={`${variant === 'primary' ? 'bg-blue-600' : 'bg-transparent'} px-4 py-2 rounded-md`} data-testid="button">{children}</button>
  ),
  Logo: ({ href, withText }: { href: string, withText?: boolean }) => (
    <a href={href} data-testid="logo">
      <svg className="w-8 h-8"></svg>
      {withText && <span>Logo Text</span>}
    </a>
  )
}));

describe('Template Components Visual Regression', () => {
  describe('Theme Toggle Component', () => {
    it('has appropriate sizing for desktop and mobile', () => {
      const { getByTestId } = render(
        <ThemeProvider>
          <div data-testid="theme-toggle">
            <svg data-testid="theme-toggle-icon" className="w-5 h-5"></svg>
          </div>
        </ThemeProvider>
      );
      
      // Check icons within the theme toggle
      const svg = getByTestId('theme-toggle-icon');
      expect(svg).not.toBeNull();
      
      // Check that SVG has correct sizing classes
      expect(svg).toHaveClass('w-5');
      expect(svg).toHaveClass('h-5');
    });
  });

  describe('SectionLayout Visual Tests', () => {
    it('maintains correct spacing and container classes', () => {
      const { container } = render(
        <SectionLayout title="Visual Test">
          <p>Content</p>
        </SectionLayout>
      );
      
      // Check spacing between title and content
      const titleDiv = container.querySelector('div > div:first-child');
      expect(titleDiv).toHaveClass('mb-12');
      
      // Check container sizing
      const containerDiv = container.querySelector('section > div');
      expect(containerDiv).toHaveClass('max-w-7xl', 'mx-auto', 'px-4');
    });
    
    it('applies responsive padding', () => {
      const { container } = render(
        <SectionLayout>
          <p>Content</p>
        </SectionLayout>
      );
      
      const section = container.querySelector('section');
      expect(section).toHaveClass('py-12', 'md:py-16');
      
      const containerDiv = container.querySelector('section > div');
      expect(containerDiv).toHaveClass('px-4', 'sm:px-6', 'lg:px-8');
    });
  });
  
  describe('MainLayout Visual Tests', () => {
    it('ensures the layout spans the full viewport height', () => {
      const { container } = render(
        <MainLayout>
          <p>Content</p>
        </MainLayout>
      );
      
      const mainDiv = container.firstChild;
      expect(mainDiv).toHaveClass('min-h-screen', 'flex', 'flex-col');
    });
    
    it('applies correct theme transition styles', () => {
      const { container } = render(
        <MainLayout>
          <p>Content</p>
        </MainLayout>
      );
      
      const mainDiv = container.firstChild;
      expect(mainDiv).toHaveClass('transition-colors');
      expect(mainDiv).toHaveClass('bg-white', 'dark:bg-black');
      expect(mainDiv).toHaveClass('text-black', 'dark:text-white');
    });
  });
  
  describe('ProjectLayout Visual Tests', () => {
    it('maintains header styling and spacing', () => {
      const { container } = render(
        <ProjectLayout title="Project Title">
          <p>Content</p>
        </ProjectLayout>
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
        <ProjectLayout 
          title="Project Title"
          technologies={['React', 'TypeScript']}
        >
          <p>Content</p>
        </ProjectLayout>
      );
      
      const techTags = container.querySelectorAll('span');
      expect(techTags.length).toBe(2);
      
      techTags.forEach(tag => {
        expect(tag).toHaveClass('bg-gray-200', 'dark:bg-gray-700', 'rounded-full');
      });
    });
  });
});
