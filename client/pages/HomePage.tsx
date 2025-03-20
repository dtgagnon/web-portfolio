import React, { useState } from 'react';
import ProjectPanel from '../components/ProjectPanel.tsx';
import AboutMe from './AboutMe.tsx';

const HomePage: React.FC = () => {
  const [showAboutMe, setShowAboutMe] = useState(false);
  
  const projects = [
    {
      title: "Cardiac Monitoring Device",
      description: "Developed a next-gen cardiac monitoring system",
      imageUrl: "data:image/svg+xml,%3Csvg width='400' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='400' height='300' fill='%230a192f'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='24' fill='white' text-anchor='middle'%3ECardiac Monitoring Device%3C/text%3E%3Cpath d='M100,150 L150,100 L200,150 L250,100 L300,150' stroke='red' stroke-width='4' fill='none'/%3E%3C/svg%3E",
      details: "Led the development of a Class II medical device for continuous cardiac monitoring. Implemented quality management systems compliant with ISO 13485 and FDA regulations. Designed and validated the device through clinical trials.",
    },
    {
      title: "Drug Delivery System",
      description: "Innovative drug delivery mechanism",
      imageUrl: "data:image/svg+xml,%3Csvg width='400' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='400' height='300' fill='%230a192f'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='24' fill='white' text-anchor='middle'%3EDrug Delivery System%3C/text%3E%3Cpath d='M150,100 L150,200 M100,150 L200,150' stroke='white' stroke-width='4' fill='none'/%3E%3Ccircle cx='250' cy='150' r='50' fill='none' stroke='white' stroke-width='4'/%3E%3C/svg%3E",
      details: "Designed and implemented a novel drug delivery system with precise dosage control. Conducted risk analysis using FMEA methodology and implemented risk mitigation strategies. Collaborated with regulatory experts to ensure compliance with applicable standards.",
    },
    {
      title: "Implantable Sensor",
      description: "Miniaturized sensor for real-time monitoring",
      imageUrl: "data:image/svg+xml,%3Csvg width='400' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='400' height='300' fill='%230a192f'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='24' fill='white' text-anchor='middle'%3EImplantable Sensor%3C/text%3E%3Ccircle cx='200' cy='150' r='70' fill='none' stroke='%2300ffff' stroke-width='4'/%3E%3Ccircle cx='200' cy='150' r='40' fill='none' stroke='%2300ffff' stroke-width='2'/%3E%3C/svg%3E",
      details: "Developed a miniaturized implantable sensor for real-time patient monitoring. Optimized power consumption and wireless data transmission capabilities. Conducted biocompatibility testing and long-term stability studies.",
    }
  ];

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-navy-700">Featured Projects</h2>
        <button
          onClick={() => setShowAboutMe(!showAboutMe)}
          className="px-6 py-3 bg-white text-navy-700 rounded-md hover:bg-gray-100 transition-colors border-2 border-navy-700 font-bold text-lg shadow-md"
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