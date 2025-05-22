import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProjectCarousel from '@/components/organisms/ProjectCarousel';
import { Project } from '@/types/project';

// Mock ProjectCard to simplify testing of ProjectCarousel
jest.mock('@/components/molecules/ProjectCard', () => {
  // The actual ProjectCard component is not relevant for these tests,
  // we only care that ProjectCarousel passes the correct props to it.
  return jest.fn(({ project }) => (
    <div data-testid="project-card">
      <h3 data-testid="project-title">{project.title}</h3>
      <p data-testid="project-description">{project.description}</p>
      <img src={project.imageUrl} alt={project.title} data-testid="project-image" />
    </div>
  ));
});

const mockProjects: Project[] = [
  { id: '1', title: 'Project Uno', description: 'Description One', imageUrl: 'url1.jpg' },
  { id: '2', title: 'Project Dos', description: 'Description Two', imageUrl: 'url2.jpg' },
  { id: '3', title: 'Project Tres', description: 'Description Three', imageUrl: 'url3.jpg' },
];

// Global mock for fetch
global.fetch = jest.fn();

const mockFetch = (data: any, ok = true, error?: Error) => {
  if (error) {
    return (global.fetch as jest.Mock).mockImplementationOnce(() => Promise.reject(error));
  }
  return (global.fetch as jest.Mock).mockImplementationOnce(() =>
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
    (global.fetch as jest.Mock).mockClear();
    jest.clearAllMocks(); // Clears mock usage data for ProjectCard
  });

  describe('Initial State & Loading', () => {
    it('displays a loading message initially', async () => {
      // Make fetch promise hang
      (global.fetch as jest.Mock).mockImplementationOnce(() => new Promise(() => {}));
      render(<ProjectCarousel />);
      expect(screen.getByText('Loading projects...')).toBeInTheDocument();
    });

    it('displays "No projects to display" if API returns an empty array', async () => {
      mockFetch({ success: true, projects: [] });
      render(<ProjectCarousel />);
      await waitFor(() => {
        expect(screen.getByText('No projects to display.')).toBeInTheDocument();
      });
    });

    it('displays an error message if the API call fails (network error)', async () => {
      mockFetch(null, false, new Error('Network Error'));
      render(<ProjectCarousel />);
      await waitFor(() => {
        expect(screen.getByText(/Error: Network Error/i)).toBeInTheDocument();
      });
    });
    
    it('displays an error message if API returns success:false', async () => {
      mockFetch({ success: false, message: 'API error occurred' }, true); // ok:true but success:false in body
      render(<ProjectCarousel />);
      await waitFor(() => {
        // The component throws 'Failed to fetch projects or data format is incorrect.'
        expect(screen.getByText(/Error: Failed to fetch projects or data format is incorrect./i)).toBeInTheDocument();
      });
    });

     it('displays an error message if API response is not as expected', async () => {
      mockFetch({ someOtherStructure: [] }); // Correctly formatted success but wrong data structure
      render(<ProjectCarousel />);
      await waitFor(() => {
        expect(screen.getByText(/Error: Failed to fetch projects or data format is incorrect./i)).toBeInTheDocument();
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
      const ProjectCardMock = require('@/components/molecules/ProjectCard');
      expect(ProjectCardMock).toHaveBeenCalledWith(expect.objectContaining({ project: mockProjects[0] }), {});
    });

    it('navigates to the next project on "Next" button click', async () => {
      render(<ProjectCarousel />);
      await waitFor(() => screen.getByText(mockProjects[0].title)); // Ensure first project loaded

      fireEvent.click(screen.getByLabelText('Next project'));
      
      await waitFor(() => {
        expect(screen.getByText(mockProjects[1].title)).toBeInTheDocument();
      });
      const ProjectCardMock = require('@/components/molecules/ProjectCard');
      expect(ProjectCardMock).toHaveBeenLastCalledWith(expect.objectContaining({ project: mockProjects[1] }), {});
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
      const ProjectCardMock = require('@/components/molecules/ProjectCard');
      expect(ProjectCardMock).toHaveBeenLastCalledWith(expect.objectContaining({ project: mockProjects[0] }), {});
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
      const ProjectCardMock = require('@/components/molecules/ProjectCard');
      expect(ProjectCardMock).toHaveBeenLastCalledWith(expect.objectContaining({ project: mockProjects[0] }), {});
    });

    it('loops to the last project when "Previous" is clicked on the first project', async () => {
      render(<ProjectCarousel />);
      await waitFor(() => screen.getByText(mockProjects[0].title)); 

      // Click previous on the first project
      fireEvent.click(screen.getByLabelText('Previous project'));
      await waitFor(() => {
        expect(screen.getByText(mockProjects[mockProjects.length - 1].title)).toBeInTheDocument(); // Should loop to last
      });
      const ProjectCardMock = require('@/components/molecules/ProjectCard');
      expect(ProjectCardMock).toHaveBeenLastCalledWith(expect.objectContaining({ project: mockProjects[mockProjects.length - 1] }), {});
    });
  });
});
