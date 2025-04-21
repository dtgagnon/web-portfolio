import React from 'react';
import { MainLayout, SectionLayout } from '@/components/atomic/templates';
import { Button } from '@/components/atomic/atoms';

export default function Resume() {
  const experienceData = [
    {
      role: 'Independent Consultant',
      company: '',
      period: '2021 - Present',
      description: 'Providing expertise in accessibility, neuroinclusive design, and medical product development to startups and established companies.',
      achievements: [
        'Advised startups and established companies on accessibility, neuroinclusive design, and medical product development',
        'Developed custom AI solutions for healthcare applications using machine learning and natural language processing',
        'Designed bespoke IoT systems for monitoring neurophysiological parameters in real-world settings'
      ]
    },
    {
      role: 'Director of Engineering',
      company: 'Seager Medical Products',
      period: '2018 - 2021',
      description: 'Led cross-functional teams in developing innovative medical devices for neurological applications.',
      achievements: [
        'Led cross-functional teams to develop and launch 5 innovative medical devices for neurological applications',
        'Managed the complete product development lifecycle from concept to manufacturing',
        'Successfully navigated FDA regulatory processes for Class II medical devices',
        'Reduced manufacturing costs by 30% through supply chain optimization and design improvements'
      ]
    },
    {
      role: 'Senior Engineer',
      company: 'BioTech Innovations',
      period: '2015 - 2018',
      description: 'Designed and developed implantable neural interfaces for research applications.',
      achievements: [
        'Designed and developed implantable neural interfaces for research applications',
        'Created firmware for real-time data acquisition and processing from neurophysiological sensors',
        'Implemented machine learning algorithms for pattern recognition in neural signals',
        'Collaborated with neuroscientists to refine and validate device performance'
      ]
    },
    {
      role: 'R&D Engineer',
      company: 'Medical Systems Corp',
      period: '2012 - 2015',
      description: 'Developed medical monitoring equipment for intensive care units.',
      achievements: [
        'Developed medical monitoring equipment for intensive care units',
        'Designed user interfaces optimized for high-stress clinical environments',
        'Conducted usability testing and iterative design improvements'
      ]
    }
  ];
  
  const educationData = [
    {
      degree: 'M.S. in Biomedical Engineering',
      institution: 'University of Michigan',
      period: '2010 - 2012',
      details: 'Thesis: Neural Interface Design for Assistive Technology Applications'
    },
    {
      degree: 'B.S. in Electrical Engineering and Computer Science',
      institution: 'Massachusetts Institute of Technology',
      period: '2006 - 2010',
      details: 'Minor in Cognitive Science'
    }
  ];
  
  const skills = [
    { category: 'Technical', items: ['Medical Device Development', 'Neural Engineering', 'AI/ML in Healthcare', 'Hardware & Firmware Design', 'Signal Processing'] },
    { category: 'Design', items: ['Accessibility & Inclusive Design', 'Human-Computer Interaction', 'UX Research', 'Prototyping', 'Design Systems'] },
    { category: 'Business', items: ['Regulatory Compliance (FDA, ISO)', 'Product Management', 'Strategic Planning', 'Interdisciplinary Collaboration', 'Project Leadership'] }
  ];
  
  return (
    <MainLayout>
      <SectionLayout
        title="Resume"
        subtitle="A summary of my professional experience, education, and skills"
        className="pb-0"
      >
        <div className="flex justify-end mb-8">
          <Button onClick={() => window.open('/resume.pdf', '_blank')} variant="primary">
            Download PDF
          </Button>
        </div>
      </SectionLayout>
      
      {/* Experience Section */}
      <SectionLayout
        title="Professional Experience"
        containerSize="md"
        className="py-8"
      >
        <div className="space-y-12">
          {experienceData.map((item, index) => (
            <div key={index} className="border-l-4 border-gray-200 dark:border-gray-800 pl-6 relative">
              <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-[#7cbddb]" />
              
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-2">
                <h3 className="text-xl font-semibold">
                  {item.role}
                  {item.company && <span className="opacity-90"> at {item.company}</span>}
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400 mt-1 sm:mt-0">
                  {item.period}
                </span>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {item.description}
              </p>
              
              <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-400">
                {item.achievements.map((achievement, idx) => (
                  <li key={idx}>{achievement}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </SectionLayout>
      
      {/* Education Section */}
      <SectionLayout
        title="Education"
        containerSize="md"
        className="py-8"
      >
        <div className="space-y-8">
          {educationData.map((item, index) => (
            <div key={index} className="border-l-4 border-gray-200 dark:border-gray-800 pl-6 relative">
              <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-[#7cbddb]" />
              
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-2">
                <h3 className="text-xl font-semibold">{item.degree}</h3>
                <span className="text-sm text-gray-500 dark:text-gray-400 mt-1 sm:mt-0">
                  {item.period}
                </span>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                {item.institution}
              </p>
              
              <p className="text-gray-600 dark:text-gray-400 italic">
                {item.details}
              </p>
            </div>
          ))}
        </div>
      </SectionLayout>
      
      {/* Skills Section */}
      <SectionLayout
        title="Skills & Expertise"
        containerSize="md"
        className="py-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {skills.map((skillGroup) => (
            <div key={skillGroup.category}>
              <h3 className="text-lg font-semibold mb-4">{skillGroup.category}</h3>
              <ul className="space-y-2">
                {skillGroup.items.map((skill) => (
                  <li key={skill} className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-[#7cbddb] mr-2" />
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </SectionLayout>
    </MainLayout>
  );
}