import React, { useState } from 'react';

interface ProjectPanelProps {
  title: string;
  description: string;
  imageUrl: string;
  details: string;
}

const ProjectPanel: React.FC<ProjectPanelProps> = ({ 
  title, 
  description, 
  imageUrl, 
  details 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-all hover:shadow-lg"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="relative h-48">
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 p-4 flex flex-col justify-end">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <p className="text-white">{description}</p>
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-4 bg-gray-100">
          <p className="text-gray-700">{details}</p>
        </div>
      )}
    </div>
  );
};

export default ProjectPanel;