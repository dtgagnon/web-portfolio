import React from 'react';
import Image from 'next/image';
import { Card } from '@/components/atomic/molecules';

interface AboutProps {
  className?: string;
}

export default function About({ className = '' }: AboutProps) {
  const skills = [
    { name: 'Medical Device Development', level: 'Expert' },
    { name: 'Neural Engineering', level: 'Expert' },
    { name: 'Accessibility & Inclusive Design', level: 'Expert' },
    { name: 'AI/ML in Healthcare', level: 'Advanced' },
    { name: 'Regulatory Compliance (FDA, ISO)', level: 'Advanced' },
    { name: 'Hardware & Firmware Design', level: 'Advanced' },
    { name: 'Human-Computer Interaction', level: 'Advanced' },
    { name: 'Signal Processing', level: 'Advanced' },
    { name: 'Product Management', level: 'Intermediate' },
    { name: 'Interdisciplinary Collaboration', level: 'Expert' },
  ];

  return (
    <div className={`space-y-12 ${className}`}>
      {/* Bio section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
        <div className="lg:col-span-2">
          <h2 className="text-3xl font-bold mb-4">About Me</h2>
          <div className="space-y-4 text-lg">
            <p>
              Hi! I'm a medical device engineer who has become a bit of an everything engineer.
              I'm passionate about creating innovative solutions that improve healthcare outcomes
              through thoughtful design and robust engineering.
            </p>
            <p>
              With extensive expertise in neurological conditions and inclusive design for 
              neurodiverse humans, I apply AI and engineering principles to solve complex 
              healthcare challenges. I've led multidisciplinary teams in developing solutions 
              for both hardware and software challenges.
            </p>
            <p>
              My analytical approach has helped organizations discover and eliminate 
              waste in supply chain management and operational protocols, while my background 
              in neural engineering informs my human-centered design philosophy.
            </p>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="relative h-64 w-64 rounded-lg overflow-hidden shadow-lg">
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
        <h2 className="text-2xl font-bold mb-6">Skills & Expertise</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((skill) => (
            <Card key={skill.name} className="h-full">
              <div className="flex flex-col h-full">
                <h3 className="font-semibold text-lg">{skill.name}</h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{skill.level}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}