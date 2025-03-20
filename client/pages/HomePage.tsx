import React, { useState } from 'react';
import ProjectPanel from '../components/ProjectPanel.tsx';
import AboutMe from './AboutMe.tsx';

const HomePage: React.FC = () => {
  const [showAboutMe, setShowAboutMe] = useState(false);
  
  const projects = [
    {
      title: "Cardiac Monitoring Device",
      description: "Developed a next-gen cardiac monitoring system",
      imageUrl: "/images/cardiac-device.jpg",
      details: "Led the development of a Class II medical device for continuous cardiac monitoring. Implemented quality management systems compliant with ISO 13485 and FDA regulations. Designed and validated the device through clinical trials.",
    },
    {
      title: "Drug Delivery System",
      description: "Innovative drug delivery mechanism",
      imageUrl: "/images/drug-delivery.jpg",
      details: "Designed and implemented a novel drug delivery system with precise dosage control. Conducted risk analysis using FMEA methodology and implemented risk mitigation strategies. Collaborated with regulatory experts to ensure compliance with applicable standards.",
    },
    {
      title: "Implantable Sensor",
      description: "Miniaturized sensor for real-time monitoring",
      imageUrl: "/images/implantable-sensor.jpg",
      details: "Developed a miniaturized implantable sensor for real-time patient monitoring. Optimized power consumption and wireless data transmission capabilities. Conducted biocompatibility testing and long-term stability studies.",
    }
  ];

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-navy-700">Featured Projects</h2>
        <button 
          onClick={() => setShowAboutMe(!showAboutMe)}
          className="px-4 py-2 bg-navy-700 text-white rounded-md hover:bg-opacity-90 transition-opacity"
        >
          {showAboutMe ? 'View Projects' : 'About Me'}
        </button>
      </div>
      
      {showAboutMe ? (
        <AboutMe />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <ProjectPanel
              key={index}
              title={project.title}
              description={project.description}
              imageUrl={project.imageUrl}
              details={project.details}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;