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
      <div className="md:w-2/3 p-6 flex flex-col justify-center">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{project.title}</h3>
          <Badge variant="outline" className="text-sm bg-opacity-20">{project.category}</Badge>
        </div>
        <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed mb-4">{project.description}</p>
        
        {/* Skills/Technologies Section */}
        {project.skills && project.skills.length > 0 && (
          <div className="mt-2">
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{skillsLabel}</h4>
            <div className="flex flex-wrap gap-2">
              {project.skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
