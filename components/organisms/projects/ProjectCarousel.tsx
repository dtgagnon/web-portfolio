import React, { useState, useEffect, useCallback } from 'react';
import ProjectCard from '../../molecules/ProjectCard';
import { Project } from '@/types/project';

interface ProjectCarouselProps {
  initialProjects?: Project[];
}

const ProjectCarousel: React.FC<ProjectCarouselProps> = ({ initialProjects = [] }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    // If we have initial projects, use them and skip the API call
    if (initialProjects.length > 0) {
      setProjects(initialProjects);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/projects');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // Handle both response formats: {success, projects} or direct array
      const projectsData = data.success && Array.isArray(data.projects) 
        ? data.projects 
        : Array.isArray(data) 
          ? data 
          : [];
          
      if (projectsData.length > 0) {
        // Create a map to deduplicate projects by ID
        const projectsMap = new Map<string, Project>();
        
        // First add initial projects if they exist
        initialProjects.forEach(project => {
          if (project.id) {
            projectsMap.set(project.id, project);
          }
        });
        
        // Then add/override with API projects
        projectsData.forEach((project: any) => {
          const validatedProject: Project = {
            id: project.id || `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            title: project.title || 'Untitled Project',
            description: project.description || 'No description available',
            imageUrl: project.imageUrl || project.image || '/images/placeholder-project.jpg',
            link: project.link || `#${project.id || ''}`,
            category: project.category || project.type || 'Uncategorized',
            skills: Array.isArray(project.skills) 
              ? project.skills 
              : (project.technologies 
                  ? (Array.isArray(project.technologies) 
                      ? project.technologies 
                      : [project.technologies]) 
                  : []),
            tags: Array.isArray(project.tags) ? project.tags : []
          };
          projectsMap.set(validatedProject.id, validatedProject);
        });
        
        const uniqueProjects = Array.from(projectsMap.values());
        setProjects(uniqueProjects);
        setCurrentIndex(0);
      } else {
        throw new Error('No projects found');
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError(err instanceof Error ? err.message : 'Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  }, [initialProjects.length]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleNext = useCallback(() => {
    setCurrentIndex(prevIndex => 
      prevIndex === projects.length - 1 ? 0 : prevIndex + 1
    );
  }, [projects.length]);

  const handlePrevious = useCallback(() => {
    setCurrentIndex(prevIndex =>
      prevIndex === 0 ? projects.length - 1 : prevIndex - 1
    );
  }, [projects.length]);

  if (isLoading) {
    return <div className="p-4 text-center">Loading projects...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  }

  if (projects.length === 0) {
    return <div className="p-4 text-center">No projects found</div>;
  }

  const currentProject = projects[currentIndex];

  return (
    <div className="flex flex-col items-center p-4 w-full">
      <div className="w-full max-w-4xl flex items-center justify-between mb-4">
        <button 
          onClick={handlePrevious} 
          className="p-2 rounded-full text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Previous project"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex-grow mx-4" style={{ minWidth: '300px', maxWidth: '600px' }}>
          <ProjectCard project={currentProject} />
        </div>

        <button 
          onClick={handleNext} 
          className="p-2 rounded-full text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Next project"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      <div className="flex space-x-2 mt-4">
        {projects.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 w-2 rounded-full transition-colors duration-150 ${
              index === currentIndex 
                ? 'bg-blue-500 dark:bg-blue-400 scale-125' 
                : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
            }`}
            aria-label={`Go to project ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectCarousel;
