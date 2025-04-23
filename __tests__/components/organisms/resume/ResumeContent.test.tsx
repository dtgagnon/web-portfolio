import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ResumeContent from '@/components/organisms/resume/ResumeContent';

describe('ResumeContent component', () => {
  beforeEach(() => {
    render(<ResumeContent />);
  });
  
  it('has the correct overall structure', () => {
    // Main container should have proper styling
    const mainContainer = screen.getByRole('heading', { level: 1 }).closest('div')?.parentElement;
    expect(mainContainer).toHaveClass('flex', 'flex-col', 'gap-8', 'p-8');
    
    // Check for proper background and text colors
    expect(mainContainer).toHaveClass('bg-white', 'text-black', 'dark:bg-black', 'dark:text-white');
    
    // Verify main sections count (contact info, summary, experience, education, expertise, projects)
    const sections = mainContainer?.childNodes;
    expect(sections).toHaveLength(6);
  });
  
  it('has properly structured contact info section', () => {
    // Contact info should be in a grid
    const contactSection = screen.getByRole('heading', { level: 1 }).closest('div');
    expect(contactSection).toHaveClass('grid', 'grid-cols-2');
    
    // Should have a heading and contact info
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(contactSection?.querySelectorAll('p').length).toBe(2); // Phone and email
  });
  
  it('has properly structured summary section', () => {
    // Find the summary section by its header
    const summaryHeading = screen.getAllByRole('heading', { level: 2 })[0];
    expect(summaryHeading).toHaveClass('flex', 'justify-center', 'border-b');
    
    const summarySection = summaryHeading.closest('div');
    
    // Should have a paragraph and bullet points
    const paragraphs = summarySection?.querySelectorAll('p');
    expect(paragraphs?.length).toBeGreaterThanOrEqual(1);
    
    // Check for bullet points
    const bulletList = summarySection?.querySelector('ul');
    expect(bulletList).toHaveClass('list-disc');
    
    const bulletItems = bulletList?.querySelectorAll('li');
    expect(bulletItems?.length).toBeGreaterThanOrEqual(3); // At least 3 bullet points in summary
  });
  
  it('has properly structured experience section', () => {
    // Find the experience section by its header (second h2)
    const experienceHeading = screen.getAllByRole('heading', { level: 2 })[1];
    expect(experienceHeading).toHaveClass('flex', 'justify-center', 'border-b');
    
    const experienceSection = experienceHeading.closest('div');
    
    // Should have company names, dates, and job descriptions
    const companies = experienceSection?.querySelectorAll('h3');
    expect(companies?.length).toBeGreaterThanOrEqual(2); // At least 2 companies listed
    
    // Should have job titles
    const jobTitles = experienceSection?.querySelectorAll('h4');
    expect(jobTitles?.length).toBeGreaterThanOrEqual(1);
    
    // Should have bullet points for responsibilities
    const bulletLists = experienceSection?.querySelectorAll('ul');
    expect(bulletLists?.length).toBeGreaterThanOrEqual(1);
  });
  
  it('has properly structured education section', () => {
    // Find the education section by its header (third h2)
    const educationHeading = screen.getAllByRole('heading', { level: 2 })[2];
    expect(educationHeading).toHaveClass('flex', 'justify-center', 'border-b');
    
    const educationSection = educationHeading.closest('div');
    
    // Should have school names
    const schools = educationSection?.querySelectorAll('h3');
    expect(schools?.length).toBeGreaterThanOrEqual(2); // At least 2 schools
    
    // Should have coursework sections
    const underlinedElements = educationSection?.querySelectorAll('u');
    expect(underlinedElements?.length).toBeGreaterThanOrEqual(2); // At least 2 "Relevant Coursework" sections
    
    // Should have bullet points for courses
    const bulletLists = educationSection?.querySelectorAll('ul');
    expect(bulletLists?.length).toBeGreaterThanOrEqual(2);
  });
  
  it('has properly structured expertise section', () => {
    // Find the expertise section by its header (fourth h2)
    const expertiseHeading = screen.getAllByRole('heading', { level: 2 })[3];
    expect(expertiseHeading).toHaveClass('flex', 'justify-center', 'border-b');
    
    const expertiseSection = expertiseHeading.closest('div');
    
    // Should have a grid layout
    const expertiseGrid = expertiseSection?.querySelector('.grid');
    expect(expertiseGrid).toHaveClass('grid-cols-1', 'md:grid-cols-2');
    
    // Should have two columns of bullet points
    const bulletLists = expertiseSection?.querySelectorAll('ul');
    expect(bulletLists?.length).toBe(2); // Two columns of skills
    
    // Each list should have multiple skills
    bulletLists?.forEach(list => {
      const items = list.querySelectorAll('li');
      expect(items.length).toBeGreaterThanOrEqual(3); // At least 3 skills per column
    });
  });
  
  it('has properly structured active projects section', () => {
    // Find the projects section by its header (fifth h2)
    const projectsHeading = screen.getAllByRole('heading', { level: 2 })[4];
    expect(projectsHeading).toHaveClass('flex', 'justify-center', 'border-b');
    
    const projectsSection = projectsHeading.closest('div');
    
    // Should have a grid layout
    const projectsGrid = projectsSection?.querySelector('.grid');
    expect(projectsGrid).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'gap-y-2');
    
    // Should have headings for project categories
    const projectCategories = projectsGrid?.querySelectorAll('h3');
    expect(projectCategories?.length).toBeGreaterThanOrEqual(2); // At least 2 project categories
    
    // Should have bullet points for projects
    const bulletLists = projectsSection?.querySelectorAll('ul');
    expect(bulletLists?.length).toBeGreaterThanOrEqual(2);
  });
  
  it('applies consistent styling to all section headers', () => {
    // All section headers should have consistent styling
    const sectionHeaders = screen.getAllByRole('heading', { level: 2 });
    
    sectionHeaders.forEach(header => {
      expect(header).toHaveClass('text-xl', 'font-bold', 'border-b');
      expect(header).toHaveClass('flex', 'justify-center');
    });
  });
});
