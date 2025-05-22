import React, { useState, useEffect } from 'react';
import ProjectCard from '../../molecules/ProjectCard'; // Updated import path
import { Project } from '@/types/project'; // Import shared Project type

const ProjectCarousel: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/projects');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.success && Array.isArray(data.projects)) {
          setProjects(data.projects);
          setCurrentIndex(0); // Reset index when new projects are loaded
        } else {
          throw new Error('Failed to fetch projects or data format is incorrect.');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handlePrevious = () => {
    if (projects.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? projects.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    if (projects.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex === projects.length - 1 ? 0 : prevIndex + 1));
  };

  if (isLoading) {
    return <div className="text-center p-10">Loading projects...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">Error: {error}</div>;
  }

  if (projects.length === 0) {
    return <div className="text-center p-10">No projects to display.</div>;
  }

  const currentProject = projects[currentIndex];

  return (
    <div className="py-6 px-4 md:px-8 text-center bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Projects</h2>
      
      <div className="flex items-center justify-center space-x-4">
        {/* Previous Button */}
        <button 
          onClick={handlePrevious} 
          className="p-3 rounded-full text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Previous project"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Project Card Area */}
        <div className="flex-grow" style={{ minWidth: '300px', maxWidth: '600px' }}> {/* Added min/max width for card area */}
          <ProjectCard project={currentProject} />
        </div>

        {/* Next Button */}
        <button 
          onClick={handleNext} 
          className="p-3 rounded-full text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Next project"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ProjectCarousel;
