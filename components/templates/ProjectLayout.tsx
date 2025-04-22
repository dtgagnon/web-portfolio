import React from 'react';
import { MainLayout } from '@/components/templates';
import { Button } from '@/components/atoms';

interface ProjectLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  technologies?: string[];
  github?: string;
  demo?: string;
  image?: string;
  className?: string;
}

export default function ProjectLayout({
  children,
  title,
  description,
  technologies = [],
  github,
  demo,
  image,
  className = ''
}: ProjectLayoutProps) {
  return (
    <MainLayout>
      {/* Project header */}
      <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="max-w-4xl">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
              {title}
            </h1>
            
            {description && (
              <p className="text-xl text-gray-500 dark:text-gray-400 mb-6">
                {description}
              </p>
            )}
            
            {technologies.length > 0 && (
              <div className="mb-8">
                <div className="flex flex-wrap gap-2">
                  {technologies.map((tech) => (
                    <span 
                      key={tech}
                      className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex flex-wrap gap-4">
              {github && (
                <Button 
                  variant="outline" 
                  onClick={() => window.open(github, '_blank')}
                >
                  View Source
                </Button>
              )}
              
              {demo && (
                <Button 
                  variant="primary" 
                  onClick={() => window.open(demo, '_blank')}
                >
                  Live Demo
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Project content */}
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ${className}`}>
        {children}
      </div>
    </MainLayout>
  );
}