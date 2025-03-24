import React, { useState } from 'react';
import ProjectPanel from '../components/ProjectPanel.tsx';

const HomePage: React.FC = () => {
  const [showProjects, setShowProjects] = useState(false);
  
  const projects = [
    {
      title: "Cardiac Monitoring Device",
      description: "Developed a next-gen cardiac monitoring system",
      imageUrl: "data:image/svg+xml,%3Csvg width='400' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='400' height='300' fill='%231c1c1c'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='24' fill='white' text-anchor='middle'%3ECardiac Monitoring Device%3C/text%3E%3Cpath d='M100,150 L150,100 L200,150 L250,100 L300,150' stroke='%23ff8fa3' stroke-width='4' fill='none'/%3E%3C/svg%3E",
      details: "Led the development of a Class II medical device for continuous cardiac monitoring. Implemented quality management systems compliant with ISO 13485 and FDA regulations. Designed and validated the device through clinical trials.",
    },
    {
      title: "Drug Delivery System",
      description: "Innovative drug delivery mechanism",
      imageUrl: "data:image/svg+xml,%3Csvg width='400' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='400' height='300' fill='%231c1c1c'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='24' fill='white' text-anchor='middle'%3EDrug Delivery System%3C/text%3E%3Cpath d='M150,100 L150,200 M100,150 L200,150' stroke='%23ff8fa3' stroke-width='4' fill='none'/%3E%3Ccircle cx='250' cy='150' r='50' fill='none' stroke='%23ff8fa3' stroke-width='4'/%3E%3C/svg%3E",
      details: "Designed and implemented a novel drug delivery system with precise dosage control. Conducted risk analysis using FMEA methodology and implemented risk mitigation strategies. Collaborated with regulatory experts to ensure compliance with applicable standards.",
    },
    {
      title: "Implantable Sensor",
      description: "Miniaturized sensor for real-time monitoring",
      imageUrl: "data:image/svg+xml,%3Csvg width='400' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='400' height='300' fill='%231c1c1c'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='24' fill='white' text-anchor='middle'%3EImplantable Sensor%3C/text%3E%3Ccircle cx='200' cy='150' r='70' fill='none' stroke='%23ff8fa3' stroke-width='4'/%3E%3Ccircle cx='200' cy='150' r='40' fill='none' stroke='%23ff8fa3' stroke-width='2'/%3E%3C/svg%3E",
      details: "Developed a miniaturized implantable sensor for real-time patient monitoring. Optimized power consumption and wireless data transmission capabilities. Conducted biocompatibility testing and long-term stability studies.",
    }
  ];

  return (
    <div className="mx-auto transition-all duration-500">
      {!showProjects ? (
        // Profile View
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center min-h-[calc(100vh-12rem)]">
          <div className="order-2 md:order-1 space-y-8">
            <div className="space-y-3">
              <h1 className="text-4xl font-bold text-dark">Derek Gagnon</h1>
              <p className="text-text/60">(yes, it's a mouthful)</p>
            </div>
            
            <p className="text-lg leading-relaxed">
              I'm a freelance medical device engineer specializing in regulatory compliance 
              and embedded systems design.
            </p>
            
            <button
              onClick={() => setShowProjects(true)}
              className="btn-secondary"
            >
              View Projects
            </button>
            
            <div className="flex space-x-6 pt-4">
              <a href="#" className="social-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="social-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6.94 5a2 2 0 1 1-4-.002 2 2 0 0 1 4 .002zM7 8.48H3V21h4V8.48zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91l.04-1.68z" />
                </svg>
              </a>
              <a href="#" className="social-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            </div>
          </div>
          
          <div className="order-1 md:order-2 flex justify-center">
            <div className="profile-image-container">
              <div className="profile-image-outline"></div>
              <div className="profile-image-accent"></div>
              <img 
                src="data:image/svg+xml,%3Csvg width='400' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='400' height='400' fill='%23faf8f2'/%3E%3Ccircle cx='200' cy='200' r='180' fill='%23faf8f2' stroke='%231c1c1c' stroke-width='2'/%3E%3Ccircle cx='200' cy='150' r='60' fill='%231c1c1c'/%3E%3Cpath d='M110,280 Q200,380 290,280 Z' fill='%231c1c1c'/%3E%3C/svg%3E" 
                alt="Profile"
                className="profile-image"
              />
            </div>
          </div>
        </div>
      ) : (
        // Projects View
        <div className="max-w-4xl mx-auto transition-all duration-500">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-2xl font-bold text-dark">Projects</h2>
            <button
              onClick={() => setShowProjects(false)}
              className="btn-secondary"
            >
              Back to Profile
            </button>
          </div>
          
          <div className="space-y-6">
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
        </div>
      )}
    </div>
  );
};

export default HomePage;