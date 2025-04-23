import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Resume from '@/components/pages/Resume';
import { MainLayout, SectionLayout } from '@/components/templates';
import { ThemeProvider } from '@/providers/ThemeContext';

// Mock the templates
vi.mock('@/components/templates', () => ({
  MainLayout: vi.fn(({ children }) => <div data-testid="main-layout">{children}</div>),
  SectionLayout: vi.fn(({ children, title, subtitle, className, containerSize }) => (
    <div 
      data-testid={`section-layout-${title?.toLowerCase().replace(/\s+/g, '-') || 'main'}`}
      className={className || ''}
      data-container-size={containerSize || 'default'}
    >
      {title && <h2>{title}</h2>}
      {subtitle && <p>{subtitle}</p>}
      {children}
    </div>
  ))
}));

// Mock Button component
vi.mock('@/components/atoms', () => ({
  Button: ({ children, onClick, variant }: any) => (
    <button 
      onClick={onClick} 
      data-testid="download-button"
      data-variant={variant}
    >
      {children}
    </button>
  )
}));

// Mock window.open
const mockOpen = vi.fn();
vi.stubGlobal('open', mockOpen);

describe('Resume Page Component', () => {
  let container: HTMLElement;
  
  beforeEach(() => {
    mockOpen.mockReset();
    const renderResult = render(
      <ThemeProvider>
        <Resume />
      </ThemeProvider>
    );
    container = renderResult.container;
  });

  it('renders the resume page with proper structure', () => {
    // Check for main layout
    expect(screen.getByTestId('main-layout')).toBeInTheDocument();
    
    // Check for main section with title and subtitle
    const mainSection = screen.getByTestId('section-layout-resume');
    expect(mainSection).toBeInTheDocument();
    expect(screen.getByText('Resume')).toBeInTheDocument();
    expect(screen.getByText(/A summary of my professional experience/)).toBeInTheDocument();
    
    // Check for other sections
    expect(screen.getByTestId('section-layout-professional-experience')).toBeInTheDocument();
    expect(screen.getByTestId('section-layout-education')).toBeInTheDocument();
    expect(screen.getByTestId('section-layout-skills-&-expertise')).toBeInTheDocument();
  });

  it('displays download button that opens resume PDF', () => {
    const downloadButton = screen.getByTestId('download-button');
    expect(downloadButton).toBeInTheDocument();
    expect(downloadButton).toHaveTextContent('Download PDF');
    
    // Click download button
    fireEvent.click(downloadButton);
    
    // Check that window.open was called with the correct URL
    expect(mockOpen).toHaveBeenCalledWith('/resume.pdf', '_blank');
  });

  it('displays professional experience with timeline', () => {
    // Check for experience section
    const experienceSection = screen.getByTestId('section-layout-professional-experience');
    expect(experienceSection).toBeInTheDocument();
    
    // Check for job titles
    expect(screen.getByText('Independent Consultant')).toBeInTheDocument();
    expect(screen.getByText(/Director of Engineering/)).toBeInTheDocument();
    expect(screen.getByText(/Senior Engineer/)).toBeInTheDocument();
    expect(screen.getByText(/R&D Engineer/)).toBeInTheDocument();
    
    // Check for companies
    expect(screen.getByText(/at Seager Medical Products/)).toBeInTheDocument();
    expect(screen.getByText(/at BioTech Innovations/)).toBeInTheDocument();
    expect(screen.getByText(/at Medical Systems Corp/)).toBeInTheDocument();
    
    // Check for time periods
    expect(screen.getByText('2021 - Present')).toBeInTheDocument();
    expect(screen.getByText('2018 - 2021')).toBeInTheDocument();
    expect(screen.getByText('2015 - 2018')).toBeInTheDocument();
    expect(screen.getByText('2012 - 2015')).toBeInTheDocument();
  });

  it('displays education information', () => {
    // Check for education section
    const educationSection = screen.getByTestId('section-layout-education');
    expect(educationSection).toBeInTheDocument();
    
    // Check for degrees
    expect(screen.getByText('M.S. in Biomedical Engineering')).toBeInTheDocument();
    expect(screen.getByText('B.S. in Electrical Engineering and Computer Science')).toBeInTheDocument();
    
    // Check for institutions
    expect(screen.getByText('University of Michigan')).toBeInTheDocument();
    expect(screen.getByText('Massachusetts Institute of Technology')).toBeInTheDocument();
    
    // Check for details
    expect(screen.getByText(/Neural Interface Design/)).toBeInTheDocument();
    expect(screen.getByText(/Minor in Cognitive Science/)).toBeInTheDocument();
  });

  it('displays skills and expertise in categorized sections', () => {
    // Check for skills section
    const skillsSection = screen.getByTestId('section-layout-skills-&-expertise');
    expect(skillsSection).toBeInTheDocument();
    
    // Check for skill categories
    expect(screen.getByText('Technical')).toBeInTheDocument();
    expect(screen.getByText('Design')).toBeInTheDocument();
    expect(screen.getByText('Business')).toBeInTheDocument();
    
    // Check for specific skills
    expect(screen.getByText('Medical Device Development')).toBeInTheDocument();
    expect(screen.getByText('Accessibility & Inclusive Design')).toBeInTheDocument();
    expect(screen.getByText('Regulatory Compliance (FDA, ISO)')).toBeInTheDocument();
  });

  it('has responsive layouts for different sections', () => {
    // Skills section should have responsive grid
    const skillsGrid = screen.getByTestId('section-layout-skills-&-expertise')
      .querySelector('.grid');
    expect(skillsGrid).toHaveClass('grid-cols-1', 'md:grid-cols-3', 'gap-8');
    
    // Experience and education sections should have proper spacing
    const experienceSection = screen.getByTestId('section-layout-professional-experience');
    expect(experienceSection).toHaveAttribute('data-container-size', 'md');
    
    const educationSection = screen.getByTestId('section-layout-education');
    expect(educationSection).toHaveAttribute('data-container-size', 'md');
  });
});
