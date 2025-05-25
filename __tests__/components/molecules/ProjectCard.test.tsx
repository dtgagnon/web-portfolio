import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProjectCard from '@/components/molecules/ProjectCard';
import { Project } from '@/types/project';

const mockProject: Project = {
  id: 'test-project',
  title: 'Test Project Title',
  description: 'This is a test project description.',
  imageUrl: 'https://example.com/test-image.jpg',
  link: '/projects/test-project',
  category: 'Engineering Design',
  skills: ['CAD Design', 'Prototyping', 'Engineering'],
  tags: []
};

describe('ProjectCard', () => {
  it('renders project details correctly', () => {
    render(<ProjectCard project={mockProject} />);

    // Check for title
    expect(screen.getByText(mockProject.title)).toBeInTheDocument();

    // Check for description
    expect(screen.getByText(mockProject.description!)).toBeInTheDocument(); // Non-null assertion as it's set in mock

    // Check for image
    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', mockProject.imageUrl);
    expect(image).toHaveAttribute('alt', mockProject.title);
    
    // Check for skills label (non-software project should show 'Skills')
    expect(screen.getByText('Skills')).toBeInTheDocument();
    
    // Check that skills are displayed
    mockProject.skills.forEach(skill => {
      expect(screen.getByText(skill)).toBeInTheDocument();
    });
    
    // Check for category badge
    expect(screen.getByText(mockProject.category)).toBeInTheDocument();
  });

  it('renders correctly when description is null', () => {
    const projectWithNullDescription: Project = {
      ...mockProject,
      description: null,
    };
    render(<ProjectCard project={projectWithNullDescription} />);

    // Check for title
    expect(screen.getByText(projectWithNullDescription.title)).toBeInTheDocument();

    // Check for image
    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', projectWithNullDescription.imageUrl);
    expect(image).toHaveAttribute('alt', projectWithNullDescription.title);
    
    // Check for description - it shouldn't be there or should be empty.
    // The current implementation renders <p>{null}</p> which doesn't create a visible element with text.
    // We can check that the full description text is not present.
    expect(screen.queryByText(mockProject.description!)).not.toBeInTheDocument();
    
    // Or, more robustly, ensure the <p> tag for description is empty if it exists
    // This requires the description <p> to have a specific test-id or role if we want to be very specific.
    // For now, checking that the text content of the description is not present is sufficient.
    // The component renders <p class="...">{project.description}</p>. If description is null, this p tag will be empty.
    // Let's find the p tag that should contain description and check its content.
    // Assuming the description is the only <p> tag directly within its parent div.
    const descriptionElement = screen.getByText(projectWithNullDescription.title).closest('div')?.querySelector('p');
    expect(descriptionElement).toBeInTheDocument();
    expect(descriptionElement).toBeEmptyDOMElement();
  });
  
  it('displays "Technologies" label for software projects', () => {
    const softwareProject: Project = {
      ...mockProject,
      category: 'Web Development',
      skills: ['Next.js', 'TypeScript', 'Tailwind CSS']
    };
    
    render(<ProjectCard project={softwareProject} />);
    
    // Check that the label is 'Technologies' for software projects
    expect(screen.getByText('Technologies')).toBeInTheDocument();
    
    // Check that skills are displayed with the correct label
    softwareProject.skills.forEach(skill => {
      expect(screen.getByText(skill)).toBeInTheDocument();
    });
  });
});
