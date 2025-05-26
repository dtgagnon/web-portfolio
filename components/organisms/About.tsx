import React from 'react';
import Image from 'next/image';
import { Card } from '@/components/molecules';
import { GearIcon } from '@/components/atoms/icons';

interface AboutProps {
  className?: string;
}

export default function About({ className = '' }: AboutProps) {
  // Define skill level type
  type SkillLevel = 'Novice' | 'Intermediate' | 'Advanced' | 'Expert';

  interface Skill {
    name: string;
    level: SkillLevel;
  }

  // Skills organized by categories
  const skillsByCategory: Record<string, Skill[]> = {
    'Medical Device Engineering': [
      { name: 'Medical Device Development', level: 'Expert' },
      { name: 'Design Controls & QMS (21 CFR 820 / ISO 13485)', level: 'Expert' },
      { name: 'Verification & Validation (V&V / TMV)', level: 'Expert' },
      { name: 'Risk Management (ISO 14971, FMEA / HA)', level: 'Advanced' },
      { name: 'Hardware & Firmware Design', level: 'Advanced' },
    ],
    'Project Management': [
      { name: 'Cross-functional Team Leadership', level: 'Expert' },
      { name: 'Project & Stakeholder Management', level: 'Expert' },
      { name: 'Interdisciplinary Collaboration', level: 'Expert' },
      { name: 'Root-Cause Analysis & Process Improvement', level: 'Advanced' },
    ],
    'Design & Development': [
      { name: 'SOLIDWORKS CAD & Rapid Prototyping', level: 'Advanced' },
      { name: 'Accessibility & Inclusive Design', level: 'Advanced' },
    ],
    'Data & Analytics': [
      { name: 'Statistical Analysis (Minitab)', level: 'Advanced' },
      { name: 'Data Analysis', level: 'Advanced' },
      { name: 'Machine Learning & Semantic Embeddings Applications', level: 'Intermediate' },
      { name: 'AI/ML in Healthcare', level: 'Intermediate' },
    ],
    'Fabrication & Manufacturing': [
      { name: 'Machining', level: 'Novice' },
      { name: 'Soldering', level: 'Novice' },
      { name: 'Welding', level: 'Novice' },
    ],
    'Software & Web Development': [
      { name: 'Software Development', level: 'Novice' },
      { name: 'Web Development', level: 'Intermediate' },
    ]
  };

  return (
    <div className={`space-y-12 ${className}`}>
      {/* Bio section */}
      <section className="grid items-center grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-4 text-3xl font-bold">About Me</h2>
          <div className="space-y-4 text-lg">
            <p>
              I'm <strong>Derek Gagnon</strong>, a Product Development Engineer with 9 years 
              of hands-on experience taking complex cardiovascular medical devices from concept 
              through commercialization under strict FDA and ISO quality systems.
            </p>
            <p>
              My career has thus focused on electro-optic blood-parameter monitoring systems. 
              I led cross-functional teams in requirements engineering, rapid prototyping, and rigorous V&V - reducing
              scrap by 25% and recovering $1M in annualized product value while automating test workflows to cut verification time 60%. 
              I have incorporated the application of machine learning systems and advanced engineering principles to solve complex healthcare challenges. 
              I've led multidisciplinary teams in developing solutions for both hardware and software challenges.
            </p>
            <p>
              With a foundation in chemistry and materials science, I bring specialized expertise in chemical biosensors,
              fluorescence, and ex vivo blood circuits. I thrive at the interface of hardware, software, and human factors - turning 
              multidisciplinary insight into safe, manufacturable, and patient-centric designs.
            </p>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="relative w-64 h-64 overflow-hidden rounded-lg shadow-lg">
            <Image
              src="/images/profile.jpg"
              alt="Derek Gagnon"
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-lg"
            />
          </div>
        </div>
      </section>
      
      {/* Skills section */}
      <section>
        <h2 className="mb-6 text-2xl font-bold">Skills & Expertise</h2>
        
        {/* Skills level legend */}
        <div className="flex justify-end pr-2 mb-6 text-xs text-gray-500 dark:text-gray-400">
          <div className="grid w-2/3 grid-cols-4 gap-1">
            <span className="text-center">Novice</span>
            <span className="text-center">Intermediate</span>
            <span className="text-center">Advanced</span>
            <span className="text-center">Expert</span>
          </div>
        </div>
        
        {/* Render skills by category with horizontal bar charts */}
        {Object.entries(skillsByCategory).map(([category, skills]) => (
          <div key={category} className="mb-10">
            <h3 className="mb-4 text-xl font-semibold text-primary">{category}</h3>
            <div className="space-y-4">
              {skills.map((skill) => {
                // Calculate width based on expertise level
                const levelMap: Record<SkillLevel, string> = {
                  'Novice': '10%',
                  'Intermediate': '37%',
                  'Advanced': '63%',
                  'Expert': '87%'
                } as const;
                const barWidth = levelMap[skill.level];
                
                // Determine bar color based on level
                const colorMap: Record<SkillLevel, string> = {
                  'Novice': 'bg-blue-300 dark:bg-blue-800',
                  'Intermediate': 'bg-blue-400 dark:bg-blue-700',
                  'Advanced': 'bg-blue-500 dark:bg-blue-600',
                  'Expert': 'bg-blue-600 dark:bg-blue-500'
                } as const;
                const barColor = colorMap[skill.level];
                
                return (
                  <div key={skill.name} className="flex items-center gap-4">
                    <div className="relative w-1/3 pr-4">
                      <div className="relative flex items-center pl-6">
                        <div className="absolute left-0 flex items-center justify-center w-5 h-5">
                          <GearIcon className="text-blue-500 dark:text-blue-400" size={12} />
                        </div>
                        <div className="text-sm font-medium leading-6">{skill.name}</div>
                      </div>
                    </div>
                    <div className="w-2/3 h-6 overflow-hidden bg-gray-100 rounded-md dark:bg-gray-800">
                      <div 
                        className={`h-full ${barColor} rounded-md transition-all duration-500 ease-out`}
                        style={{ width: barWidth }}
                        title={`${skill.level}`}
                      >
                        <span className="pl-2 text-xs font-medium text-white whitespace-nowrap">{skill.level}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}