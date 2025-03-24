import React from 'react';
import Resume from '../components/Resume.tsx';

const AboutMe: React.FC = () => {
  return (
    <section className="py-12 bg-white rounded-lg shadow-md">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6 text-navy-700">About Me</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="bg-gray-100 p-6 rounded-lg">
              <img 
                src="data:image/svg+xml,%3Csvg width='50' height='50' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='50' height='50' fill='%230a192f'/%3E%3Ccircle cx='25' cy='18.75' r='12.5' fill='%23d1d5db'/%3E%3Ccircle cx='25' cy='56.25' r='25' fill='%23d1d5db'/%3E%3C/svg%3E" 
                alt="Profile" 
                className="w-full h-auto rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">Contact</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <img
                    src="data:image/svg+xml,%3Csvg width='50' height='50' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='50' height='50' fill='%230a192f'/%3E%3Ccircle cx='25' cy='18.75' r='12.5' fill='%23d1d5db'/%3E%3Ccircle cx='25' cy='56.25' r='25' fill='%23d1d5db'/%3E%3C/svg%3E"
                    alt="Email"
                    className="w-4 h-4 mr-2"
                  />
                  <span>derek@derektgagnon.com</span>
                </li>
                <li className="flex items-center">
                  <img
                    src="data:image/svg+xml,%3Csvg width='50' height='50' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='50' height='50' fill='%230a192f'/%3E%3Ccircle cx='25' cy='18.75' r='12.5' fill='%23d1d5db'/%3E%3Ccircle cx='25' cy='56.25' r='25' fill='%23d1d5db'/%3E%3C/svg%3E"
                    alt="Email"
                    className="w-4 h-4 mr-2"
                  />
                  <span>517.902.3799</span>
                </li>
                <li className="flex items-center">
                  <img
                    src="data:image/svg+xml,%3Csvg width='50' height='50' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='50' height='50' fill='%230a192f'/%3E%3Ccircle cx='25' cy='18.75' r='12.5' fill='%23d1d5db'/%3E%3Ccircle cx='25' cy='56.25' r='25' fill='%23d1d5db'/%3E%3C/svg%3E"
                    alt="Email"
                    className="w-4 h-4 mr-2"
                  />
                  <span>github.com/dtgagnon</span>
                </li>
                <li className="flex items-center">
                  <img
                    src="data:image/svg+xml,%3Csvg width='50' height='50' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='50' height='50' fill='%230a192f'/%3E%3Ccircle cx='25' cy='18.75' r='12.5' fill='%23d1d5db'/%3E%3Ccircle cx='25' cy='56.25' r='25' fill='%23d1d5db'/%3E%3C/svg%3E"
                    alt="Email"
                    className="w-4 h-4 mr-2"
                  />
                  <span>Ann Arbor, MI</span>
                </li>
              </ul>
            </div>
          </div>
          <Resume />
        </div>
      </div>
    </section>
  );
};

export default AboutMe;