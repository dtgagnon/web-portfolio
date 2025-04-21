import React, { useState } from 'react';
import { MainLayout, SectionLayout } from '@/components/atomic/templates';
import { Card } from '@/components/atomic/molecules';
import Image from 'next/image';

export default function Projects() {
  // Categories for filtering
  const categories = ['All', 'Medical Devices', 'Inclusive Design', 'AI/ML', 'IoT'];
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Project data
  const projects = [
    {
      id: 1,
      title: 'NeuroAssist',
      description: 'AI-powered application that adapts digital interfaces in real-time based on neurophysiological feedback to improve accessibility for users with various cognitive profiles.',
      image: '/images/projects/neuroassist.jpg',
      link: '/projects/neuroassist',
      category: 'AI/ML',
      technologies: ['Machine Learning', 'React', 'Python', 'Neurophysiology']
    },
    {
      id: 2,
      title: 'MindfulTech Framework',
      description: 'Open-source design framework for creating technology that accommodates diverse cognitive processing styles, with a focus on reducing cognitive load and sensory overwhelm.',
      image: '/images/projects/mindfultech.jpg',
      link: '/projects/mindfultech-framework',
      category: 'Inclusive Design',
      technologies: ['UX Design', 'Accessibility', 'Documentation', 'Web Standards']
    },
    {
      id: 3,
      title: 'SenseNet',
      description: 'Wearable IoT ecosystem that monitors environmental factors known to trigger sensory sensitivities, providing personalized alerts and adaptation recommendations.',
      image: '/images/projects/sensenet.jpg',
      link: '/projects/sensenet',
      category: 'IoT',
      technologies: ['IoT', 'Embedded Systems', 'Mobile App', 'Sensors']
    },
    {
      id: 4,
      title: 'CogniCompanion',
      description: 'Digital assistant specifically designed to support executive functioning challenges through personalized reminders, task breakdown, and adaptive scheduling.',
      image: '/images/projects/cognicompanion.jpg',
      link: '/projects/cognicompanion',
      category: 'AI/ML',
      technologies: ['AI/ML', 'React Native', 'Node.js', 'Cognitive Science']
    },
    {
      id: 5,
      title: 'Neural Interface Prototype',
      description: 'Implantable medical device that creates a direct communication pathway between the brain and external devices for assistive technology applications.',
      image: '/images/projects/neural-interface.jpg',
      link: '/projects/neural-interface',
      category: 'Medical Devices',
      technologies: ['Medical Electronics', 'Signal Processing', 'Embedded Systems', 'Biocompatibility']
    },
    {
      id: 6,
      title: 'Sensory-Adaptive Spaces',
      description: 'Smart environment system that automatically adjusts lighting, sound, and spatial elements based on occupant needs and sensory preferences.',
      image: '/images/projects/sensory-spaces.jpg',
      link: '/projects/sensory-spaces',
      category: 'IoT',
      technologies: ['Smart Home', 'Sensors', 'Automation', 'Ambient Computing']
    },
  ];
        
        // Filter projects based on active category
        const filteredProjects = activeCategory === 'All' 
            ? projects 
            : projects.filter(project => project.category === activeCategory);
        
        return (
        <MainLayout>
        <SectionLayout
            title="Projects"
            subtitle="Explore my work in medical technology, inclusive design, and healthcare innovation"
            className="pb-4"
        >
            {/* Category filters */}
            <div className="flex flex-wrap gap-2 mb-12">
            {categories.map((category) => (
                <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full transition-colors ${
                    activeCategory === category
                    ? 'bg-[#7cbddb] text-black'
                    : 'bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700'
                }`}
                >
                {category}
                </button>
            ))}
            </div>
            
            {/* Projects grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
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
                <p className="text-gray-600 dark:text-gray-400 mb-4">{project.description}</p>
                
                <div className="mt-auto">
                    <div className="flex flex-wrap gap-1">
                    {project.technologies.slice(0, 3).map((tech) => (
                        <span 
                        key={tech}
                        className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded"
                        >
                        {tech}
                        </span>
                    ))}
                    {project.technologies.length > 3 && (
                        <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">
                        +{project.technologies.length - 3} more
                        </span>
                    )}
                    </div>
                </div>
                </Card>
            ))}
            </div>
        </SectionLayout>
        </MainLayout>
    );
    }