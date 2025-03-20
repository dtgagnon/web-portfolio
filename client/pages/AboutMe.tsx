import React from 'react';

const AboutMe: React.FC = () => {
  return (
    <section className="py-12 bg-white rounded-lg shadow-md">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6 text-navy-700">About Me</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="bg-gray-100 p-6 rounded-lg">
              <img 
                src="/images/profile.jpg" 
                alt="Profile" 
                className="w-full h-auto rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">Contact</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-navy-700" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span>email@example.com</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-navy-700" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <span>(123) 456-7890</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-navy-700" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                  </svg>
                  <span>github.com/username</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-navy-700" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span>San Francisco, CA</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <div className="prose max-w-none">
              <p className="text-lg mb-4">
                I am a product development engineer specializing in the medical device industry with extensive experience in quality and regulatory knowledge. My expertise spans across product development, quality engineering, systems engineering, prototyping, and mechanical/chemical engineering.
              </p>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">Professional Experience</h3>
              <div className="mb-4">
                <h4 className="font-medium">Senior Product Development Engineer</h4>
                <p className="text-gray-600">Medical Innovations Inc. | 2018 - Present</p>
                <ul className="list-disc pl-5 mt-2">
                  <li>Led cross-functional teams in developing Class II medical devices</li>
                  <li>Implemented quality management systems compliant with ISO 13485</li>
                  <li>Managed design control processes and risk management activities</li>
                </ul>
              </div>
              
              <div className="mb-4">
                <h4 className="font-medium">Quality Engineer</h4>
                <p className="text-gray-600">Healthcare Solutions | 2015 - 2018</p>
                <ul className="list-disc pl-5 mt-2">
                  <li>Developed and maintained quality systems for medical device manufacturing</li>
                  <li>Conducted internal audits and prepared for FDA inspections</li>
                  <li>Implemented corrective and preventive action (CAPA) processes</li>
                </ul>
              </div>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">Education</h3>
              <div className="mb-4">
                <h4 className="font-medium">Master of Science in Biomedical Engineering</h4>
                <p className="text-gray-600">Stanford University | 2015</p>
              </div>
              
              <div className="mb-4">
                <h4 className="font-medium">Bachelor of Science in Mechanical Engineering</h4>
                <p className="text-gray-600">University of California, Berkeley | 2013</p>
              </div>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">Skills</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-navy-700 text-white rounded-full text-sm">Product Development</span>
                <span className="px-3 py-1 bg-navy-700 text-white rounded-full text-sm">Quality Engineering</span>
                <span className="px-3 py-1 bg-navy-700 text-white rounded-full text-sm">Systems Engineering</span>
                <span className="px-3 py-1 bg-navy-700 text-white rounded-full text-sm">Prototyping</span>
                <span className="px-3 py-1 bg-navy-700 text-white rounded-full text-sm">Mechanical Engineering</span>
                <span className="px-3 py-1 bg-navy-700 text-white rounded-full text-sm">Chemical Engineering</span>
                <span className="px-3 py-1 bg-navy-700 text-white rounded-full text-sm">ISO 13485</span>
                <span className="px-3 py-1 bg-navy-700 text-white rounded-full text-sm">FDA Regulations</span>
                <span className="px-3 py-1 bg-navy-700 text-white rounded-full text-sm">Risk Management</span>
                <span className="px-3 py-1 bg-navy-700 text-white rounded-full text-sm">Design Controls</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;