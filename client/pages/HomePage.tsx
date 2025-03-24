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
          <div className="order-2 md:order-1 space-y-6">
            <div className="space-y-1">
              <h1 className="text-5xl font-bold text-dark">Tamara<br/>Sredojevic</h1>
              <p className="text-text/60 text-sm">(yes, it's a mouthful)</p>
            </div>
            
            <p className="text-base leading-relaxed">
              I'm a freelance UX designer specialising in accessibility and
              neuroinclusive design.
            </p>
            
            <div className="flex space-x-4 pt-2">
              <a href="#" className="social-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                </svg>
              </a>
              <a href="#" className="social-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a href="#" className="social-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M12 12.713l-11.985-9.713h23.97l-11.985 9.713zm0 2.574l-12-9.725v15.438h24v-15.438l-12 9.725z" />
                </svg>
              </a>
              <a href="#" className="social-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
            </div>
          </div>
          
          <div className="order-1 md:order-2 flex justify-center">
            <div className="profile-image-container relative">
              <div className="absolute inset-0 rounded-full bg-[#1c1c1c] z-10"></div>
              <div className="absolute inset-0 rounded-full bg-[#ff8fa3] z-0 translate-x-4 -translate-y-4"></div>
              <img 
                src="https://placehold.co/400x400/faf8f2/1c1c1c?text=Profile+Image" 
                alt="Profile"
                className="relative z-20 rounded-full w-full h-full object-cover border-4 border-[#faf8f2]"
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