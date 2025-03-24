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
      className="bg-white/50 backdrop-blur-sm rounded-2xl overflow-hidden cursor-pointer transition-all hover:bg-white/70"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/3 relative h-48 md:h-auto">
          <img 
            src={imageUrl} 
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-dark/10"></div>
        </div>
        <div className="w-full md:w-2/3 p-6 md:p-8">
          <h3 className="text-xl font-medium mb-2 text-dark">{title}</h3>
          <p className="text-text/80 mb-4">{description}</p>
          
          <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-96' : 'max-h-0'}`}>
            <div className="pt-4 border-t border-dark/10">
              <p className="text-text/70 text-sm leading-relaxed">{details}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectPanel;