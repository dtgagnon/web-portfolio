import React from 'react';
import { MainLayout, SectionLayout } from '@/components/templates';
import { Hero, ContactForm } from '@/components/organisms';
import { Card } from '@/components/molecules';
import Image from 'next/image';

export default function Home() {
  const projects = [
    {
      id: 1,
      title: 'NeuroAssist',
      description: 'AI-powered application that adapts digital interfaces in real-time based on neurophysiological feedback.',
      image: '/images/projects/neuroassist.jpg',
      link: '/projects/neuroassist'
    },
    {
      id: 2,
      title: 'MindfulTech Framework',
      description: 'Open-source design framework for creating technology that accommodates diverse cognitive processing styles.',
      image: '/images/projects/mindfultech.jpg',
      link: '/projects/mindfultech-framework'
    },
    {
      id: 3,
      title: 'SenseNet',
      description: 'Wearable IoT ecosystem that monitors environmental factors known to trigger sensory sensitivities.',
      image: '/images/projects/sensenet.jpg',
      link: '/projects/sensenet'
    },
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <Hero 
        title="Medical Device Engineer & Neuroinclusive Design Expert"
        subtitle="Creating innovative solutions at the intersection of healthcare, technology, and accessibility."
      />
      
      {/* Featured Projects Section */}
      <SectionLayout
        title="Featured Projects"
        subtitle="A showcase of my recent work in medical technology and inclusive design"
        id="projects"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <Card 
              key={project.id}
              hoverable
              className="h-full"
              onClick={() => window.location.href = project.link}
            >
              <div className="relative h-48 mb-4 rounded overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{project.description}</p>
            </Card>
          ))}
        </div>
      </SectionLayout>
      
      {/* Contact Section */}
      <SectionLayout
        title="Let's Connect"
        subtitle="Have a project in mind or want to collaborate? Get in touch!"
        id="contact"
        className="bg-gray-50 dark:bg-gray-900"
      >
        <div className="max-w-3xl mx-auto">
          <ContactForm />
        </div>
      </SectionLayout>
    </MainLayout>
  );
}