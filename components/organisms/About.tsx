import React from 'react';
import Image from 'next/image';
import { Card } from '@/components/molecules';

interface AboutProps {
  className?: string;
}

export default function About({ className = '' }: AboutProps) {
  // Skills organized by categories
  const skillsByCategory = {
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
        
        {/* Render skills by category */}
        {Object.entries(skillsByCategory).map(([category, skills]) => (
          <div key={category} className="mb-8">
            <h3 className="mb-4 text-xl font-semibold text-primary">{category}</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {skills.map((skill) => (
                <Card key={skill.name} className="h-full">
                  <div className="flex flex-col h-full">
                    <h3 className="text-lg font-semibold">{skill.name}</h3>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{skill.level}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}