import React from 'react';
import { Project } from '@/types/project';
import Badge from '@/components/atoms/Badge';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  // Determine if this is a software-related project
  const isSoftwareProject = [
    'Web Development',
    'Software Engineering',
    'App Development',
    'Data Science'
  ].includes(project.category);
  
  // Set the appropriate label based on project category
  const skillsLabel = isSoftwareProject ? 'Technologies' : 'Skills';
  
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
      <div className="md:w-2/3 p-6 flex flex-col justify-between">
        <div>
          {/* Title */}
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{project.title}</h3>
          
          {/* Skills/Technologies Section - Directly below title */}
          {project.skills && project.skills.length > 0 && (
            <div className="mb-3">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{skillsLabel}:</span>
                {project.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill || ''}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {/* Category Badge */}
          <div className="mb-3">
            <Badge variant="outline">
              {project.category || 'Uncategorized'}
            </Badge>
          </div>
          
          {/* Description */}
          <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed mb-4">{project.description}</p>
        </div>
        
        {/* Learn More Link */}
        <div className="mt-auto">
          <a 
            href={project.link} 
            className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            Learn more
            <svg className="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
