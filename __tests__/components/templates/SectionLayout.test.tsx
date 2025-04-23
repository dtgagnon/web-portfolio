import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import SectionLayout from '@/components/templates/SectionLayout';

describe('SectionLayout component', () => {
  // Functional Tests
  describe('Functionality', () => {
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

  it('applies different container sizes based on containerSize prop', () => {
    const sizes = [
      { prop: 'sm', class: 'max-w-3xl' },
      { prop: 'md', class: 'max-w-5xl' },
      { prop: 'lg', class: 'max-w-7xl' },
      { prop: 'xl', class: 'max-w-[90rem]' },
      { prop: 'full', class: 'w-full' }
    ];

    sizes.forEach(({ prop, class: className }) => {
      const { container, unmount } = render(
        <SectionLayout containerSize={prop as 'sm' | 'md' | 'lg' | 'xl' | 'full'}>
          <p>Test Content</p>
        </SectionLayout>
      );
      
      const containerDiv = container.querySelector('section > div');
      expect(containerDiv).toHaveClass(className);
      
      unmount();
    });
  });

  it('renders without title and subtitle when not provided', () => {
    const { container } = render(
      <SectionLayout>
        <p>Test Content</p>
      </SectionLayout>
    );
    
    // Check that no title element exists
    expect(container.querySelector('h2')).not.toBeInTheDocument();
    expect(container.querySelector('p.text-xl')).not.toBeInTheDocument();
    
    // The content div should exist and contain the test content
    const contentDiv = container.querySelector('div > div');
    const testContent = screen.getByText('Test Content');
    expect(contentDiv).toContainElement(testContent);
  });

  it('applies id attribute when provided', () => {
    const { container } = render(
      <SectionLayout id="test-section">
        <p>Test Content</p>
      </SectionLayout>
    );
    
    const section = container.querySelector('section');
    expect(section).toHaveAttribute('id', 'test-section');
  });
  });
  
  // Visual Tests
  describe('Visual appearance', () => {
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
});
