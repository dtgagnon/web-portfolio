import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi, describe, it, expect, beforeEach, Mock } from 'vitest'; // Added vitest imports, including Mock
import ProjectCarousel from '@/components/organisms/projects/ProjectCarousel'; // Updated import path
import ProjectCard from '@/components/molecules/ProjectCard'; // Import ProjectCard
import { Project } from '@/types/project';

// Mock ProjectCard to simplify testing of ProjectCarousel
vi.mock('@/components/molecules/ProjectCard', () => ({
  default: vi.fn(({ project }: { project: Project }) => (
    <div data-testid="project-card">
      <h3 data-testid="project-title">{project.title}</h3>
      <p data-testid="project-description">{project.description}</p>
      <img src={project.imageUrl} alt={project.title} data-testid="project-image" />
    </div>
  ))
}));

const mockProjects: Project[] = [
  { 
    id: '1', 
    title: 'Project Uno', 
    description: 'Description One', 
    imageUrl: 'url1.jpg',
    link: '#1',
    category: 'Web Development',
    skills: ['React', 'TypeScript'],
    tags: ['frontend', 'responsive']
  },
  { 
    id: '2', 
    title: 'Project Dos', 
    description: 'Description Two', 
    imageUrl: 'url2.jpg',
    link: '#2',
    category: 'Mobile App',
    skills: ['React Native', 'Firebase'],
    tags: ['mobile', 'cross-platform']
  },
  { 
    id: '3', 
    title: 'Project Tres', 
    description: 'Description Three', 
    imageUrl: 'url3.jpg',
    link: '#3',
    category: 'Backend',
    skills: ['Node.js', 'PostgreSQL'],
    tags: ['api', 'database']
  },
];

// Global mock for fetch
global.fetch = vi.fn();

const mockFetch = (data: any, ok = true, error?: Error) => {
  if (error) {
    return (global.fetch as Mock).mockImplementationOnce(() => Promise.reject(error));
  }
  return (global.fetch as Mock).mockImplementationOnce(() =>
    Promise.resolve({
      ok: ok,
      json: () => Promise.resolve(data),
      status: ok ? 200 : 500,
    })
  );
};


describe('ProjectCarousel', () => {
  beforeEach(() => {
    // Reset mocks before each test
    (global.fetch as Mock).mockClear();
    vi.clearAllMocks(); // Clears mock usage data for ProjectCard
  });

  describe('Initial State & Loading', () => {
    it('displays a loading message initially', async () => {
      // Make fetch promise hang
      (global.fetch as Mock).mockImplementationOnce(() => new Promise(() => {}));
      render(<ProjectCarousel />);
      expect(screen.getByText('Loading projects...')).toBeInTheDocument();
    });

    it('displays "No projects found" if API returns an empty array', async () => {
      mockFetch({ success: true, projects: [] });
      render(<ProjectCarousel />);
      await waitFor(() => {
        const errorContainer = screen.getByText(/Error:/).closest('div');
        expect(errorContainer).toHaveTextContent('No projects found');
      });
    });

    it('displays an error message if the API call fails (network error)', async () => {
      mockFetch(null, false, new Error('Network Error'));
      render(<ProjectCarousel />);
      await waitFor(() => {
        expect(screen.getByText(/Error: Network Error/i)).toBeInTheDocument();
      });
    });
    
    it('displays "No projects found" if API returns success:false', async () => {
      mockFetch({ success: false, message: 'API error occurred' }, true); // ok:true but success:false in body
      render(<ProjectCarousel />);
      await waitFor(() => {
        const errorContainer = screen.getByText(/Error:/).closest('div');
        expect(errorContainer).toHaveTextContent('No projects found');
      });
    });

     it('displays "No projects found" if API response is not as expected', async () => {
      mockFetch({ someOtherStructure: [] }); // Correctly formatted success but wrong data structure
      render(<ProjectCarousel />);
      await waitFor(() => {
        const errorContainer = screen.getByText(/Error:/).closest('div');
        expect(errorContainer).toHaveTextContent('No projects found');
      });
    });
  });

  describe('Data Display & Navigation', () => {
    beforeEach(() => {
      // Setup successful fetch for these tests
      mockFetch({ success: true, projects: mockProjects });
    });

    it('renders the first project card after data is fetched', async () => {
      render(<ProjectCarousel />);
      await waitFor(() => {
        expect(screen.getByTestId('project-card')).toBeInTheDocument();
        expect(screen.getByText(mockProjects[0].title)).toBeInTheDocument();
        expect(screen.getByText(mockProjects[0].description!)).toBeInTheDocument();
        const image = screen.getByRole('img') as HTMLImageElement;
        expect(image.src).toContain(mockProjects[0].imageUrl);
      });
       // Verify ProjectCard was called with the first project
      const ProjectCardMock = vi.mocked(ProjectCard);
      expect(ProjectCardMock).toHaveBeenCalledWith(expect.objectContaining({ project: mockProjects[0] }), undefined);
    });

    it('navigates to the next project on "Next" button click', async () => {
      render(<ProjectCarousel />);
      await waitFor(() => screen.getByText(mockProjects[0].title)); // Ensure first project loaded

      fireEvent.click(screen.getByLabelText('Next project'));
      
      await waitFor(() => {
        expect(screen.getByText(mockProjects[1].title)).toBeInTheDocument();
      });
      const ProjectCardMock = vi.mocked(ProjectCard);
      expect(ProjectCardMock).toHaveBeenLastCalledWith(expect.objectContaining({ project: mockProjects[1] }), undefined);
    });

    it('navigates to the previous project on "Previous" button click', async () => {
      render(<ProjectCarousel />);
      await waitFor(() => screen.getByText(mockProjects[0].title)); 

      // Go to next first, then previous
      fireEvent.click(screen.getByLabelText('Next project'));
      await waitFor(() => screen.getByText(mockProjects[1].title));
      
      fireEvent.click(screen.getByLabelText('Previous project'));
      await waitFor(() => {
        expect(screen.getByText(mockProjects[0].title)).toBeInTheDocument();
      });
      const ProjectCardMock = vi.mocked(ProjectCard);
      expect(ProjectCardMock).toHaveBeenLastCalledWith(expect.objectContaining({ project: mockProjects[0] }), undefined);
    });

    it('loops to the first project when "Next" is clicked on the last project', async () => {
      render(<ProjectCarousel />);
      await waitFor(() => screen.getByText(mockProjects[0].title));

      // Click next twice to get to the last project (index 2)
      fireEvent.click(screen.getByLabelText('Next project'));
      await waitFor(() => screen.getByText(mockProjects[1].title));
      fireEvent.click(screen.getByLabelText('Next project'));
      await waitFor(() => screen.getByText(mockProjects[2].title));

      // Click next on the last project
      fireEvent.click(screen.getByLabelText('Next project'));
      await waitFor(() => {
        expect(screen.getByText(mockProjects[0].title)).toBeInTheDocument(); // Should loop to first
      });
      const ProjectCardMock = vi.mocked(ProjectCard);
      expect(ProjectCardMock).toHaveBeenLastCalledWith(expect.objectContaining({ project: mockProjects[0] }), undefined);
    });

    it('loops to the last project when "Previous" is clicked on the first project', async () => {
      render(<ProjectCarousel />);
      await waitFor(() => screen.getByText(mockProjects[0].title)); 

      // Click previous on the first project
      fireEvent.click(screen.getByLabelText('Previous project'));
      await waitFor(() => {
        expect(screen.getByText(mockProjects[mockProjects.length - 1].title)).toBeInTheDocument(); // Should loop to last
      });
      const ProjectCardMock = vi.mocked(ProjectCard);
      expect(ProjectCardMock).toHaveBeenLastCalledWith(expect.objectContaining({ project: mockProjects[mockProjects.length - 1] }), undefined);
    });
  });
});
