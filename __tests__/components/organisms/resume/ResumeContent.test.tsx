import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ResumeContent from '@/components/organisms/resume/ResumeContent';

describe('ResumeContent component', () => {
  beforeEach(() => {
    render(<ResumeContent />);
  });
  
  it('renders the contact info section', () => {
    expect(screen.getByText('Derek T Gagnon')).toBeInTheDocument();
    expect(screen.getByText('517-902-3799')).toBeInTheDocument();
    expect(screen.getByText('gagnon.derek@protonmail.com')).toBeInTheDocument();
  });
  
  it('renders the summary section', () => {
    expect(screen.getByText('SUMMARY')).toBeInTheDocument();
    expect(screen.getByText('Systems Engineer • Medical Devices & Biotechnology • PD Expertise')).toBeInTheDocument();
    expect(screen.getByText(/Med-Tech Engineering Professional with 9\+ years of experience/)).toBeInTheDocument();
    expect(screen.getByText(/Adept at leading cross-functional teams/)).toBeInTheDocument();
    expect(screen.getByText(/Proven track record of delivering complex projects/)).toBeInTheDocument();
    expect(screen.getByText(/Leverages unique background/)).toBeInTheDocument();
  });
  
  it('renders the experience section', () => {
    expect(screen.getByText('EXPERIENCE')).toBeInTheDocument();
    expect(screen.getByText('TERUMO CARDIOVASCULAR - ANN ARBOR, MI')).toBeInTheDocument();
    expect(screen.getByText('2017 – 2024')).toBeInTheDocument();
    expect(screen.getByText('PRODUCT DEVELOPMENT ENGINEER')).toBeInTheDocument();
    expect(screen.getByText('Design, Develop, Prototype, Test, Refine, Verify & Validate')).toBeInTheDocument();
    
    expect(screen.getByText('ANDERSON DEVELOPMENT COMPANY – ADRIAN, MI')).toBeInTheDocument();
    expect(screen.getByText('2015 – 2017')).toBeInTheDocument();
    expect(screen.getByText('RESEARCH & DEVELOPMENT ENGINEER')).toBeInTheDocument();
  });
  
  it('renders the education section', () => {
    expect(screen.getByText('EDUCATION')).toBeInTheDocument();
    expect(screen.getByText('UNIVERSITY OF MICHIGAN – Materials Science & Engineering')).toBeInTheDocument();
    // Using getAllByText since this text appears multiple times
    expect(screen.getAllByText('Ann Arbor, Michigan')[0]).toBeInTheDocument();
    // Using getAllByText since 'Relevant Coursework' appears multiple times
    const relevantCourseworks = screen.getAllByText('Relevant Coursework');
    expect(relevantCourseworks.length).toBeGreaterThanOrEqual(1);
    
    expect(screen.getByText('SIENA HEIGHTS UNIVERSITY – B.S. CHEMISTRY')).toBeInTheDocument();
    expect(screen.getAllByText('Relevant Coursework').length).toBe(2); // One for each education listing
  });
  
  it('renders the expertise section', () => {
    expect(screen.getByText('EXPERTISE')).toBeInTheDocument();
    expect(screen.getByText(/Systems Engineering:/)).toBeInTheDocument();
    expect(screen.getByText(/Testing:/)).toBeInTheDocument();
    expect(screen.getByText(/Regulatory & Standards Knowledge:/)).toBeInTheDocument();
    expect(screen.getByText(/Unique Subject Matter Expertise:/)).toBeInTheDocument();
    expect(screen.getByText(/Specialized Knowledge:/)).toBeInTheDocument();
    expect(screen.getByText(/Leadership:/)).toBeInTheDocument();
    expect(screen.getByText(/Process Trending and Improvements:/)).toBeInTheDocument();
    expect(screen.getByText('Other:')).toBeInTheDocument();
  });
  
  it('renders the active projects section', () => {
    expect(screen.getByText('ACTIVE PROJECTS')).toBeInTheDocument();
    expect(screen.getByText('DTG Engineering – Engineering Services')).toBeInTheDocument();
    expect(screen.getByText('Quality Management')).toBeInTheDocument();
    expect(screen.getByText('Mechanical/CAD')).toBeInTheDocument();
    
    expect(screen.getByText('Personal Projects')).toBeInTheDocument();
    expect(screen.getByText(/Designing medical device applications/)).toBeInTheDocument();
    expect(screen.getByText(/Learning NixOS for deployment/)).toBeInTheDocument();
    expect(screen.getByText(/A custom ergonomic split mechanical keyboard/)).toBeInTheDocument();
    expect(screen.getByText(/An interactive personal portfolio website/)).toBeInTheDocument();
  });
  
  it('has the correct structure with all sections', () => {
    const mainContainer = screen.getByText('Derek T Gagnon').closest('div')?.parentElement;
    expect(mainContainer).toHaveClass('flex', 'flex-col', 'gap-8', 'p-8');
    
    // Verify the number of sections (there should be 6 main sections)
    const sections = mainContainer?.childNodes;
    expect(sections).toHaveLength(6);
  });
  
  it('applies correct styling to section headers', () => {
    const sectionHeaders = screen.getAllByText(/(SUMMARY|EXPERIENCE|EDUCATION|EXPERTISE|ACTIVE PROJECTS)/);
    
    sectionHeaders.forEach(header => {
      expect(header).toHaveClass('text-xl', 'font-bold', 'border-b');
    });
  });
  
  it('applies correct grid layout to expertise section', () => {
    const expertiseGrids = screen.getByText('EXPERTISE').closest('div')?.querySelector('.grid');
    expect(expertiseGrids).toHaveClass('grid-cols-1', 'md:grid-cols-2');
  });
  
  it('applies correct grid layout to active projects section', () => {
    const projectsGrid = screen.getByText('ACTIVE PROJECTS').closest('div')?.querySelector('.grid');
    expect(projectsGrid).toHaveClass('grid-cols-1', 'md:grid-cols-2');
  });
});
