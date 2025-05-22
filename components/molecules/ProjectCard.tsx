import React from 'react';
import { Project } from '@/types/project'; // Updated import path

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden flex flex-col md:flex-row w-full">
      {/* Image Column */}
      <div className="md:w-1/3 p-4 flex-shrink-0">
        <img 
          src={project.imageUrl} 
          alt={project.title} 
          className="w-full h-auto md:h-full object-cover rounded-md shadow-md" 
        />
      </div>
      {/* Text Content Column */}
      <div className="md:w-2/3 p-6 flex flex-col justify-center">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{project.title}</h3>
        <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">{project.description}</p>
      </div>
    </div>
  );
};

export default ProjectCard;
