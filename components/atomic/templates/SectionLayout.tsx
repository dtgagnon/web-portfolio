import React from 'react';

interface SectionLayoutProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  title?: string;
  subtitle?: string;
  centered?: boolean;
  withContainer?: boolean;
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export default function SectionLayout({
  children,
  id,
  className = '',
  title,
  subtitle,
  centered = false,
  withContainer = true,
  containerSize = 'lg'
}: SectionLayoutProps) {
  const containerSizes = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-7xl',
    xl: 'max-w-[90rem]',
    full: 'w-full'
  };
  
  const containerClasses = withContainer 
    ? `${containerSizes[containerSize]} mx-auto px-4 sm:px-6 lg:px-8` 
    : '';
  
  const contentClasses = centered 
    ? 'flex flex-col items-center text-center' 
    : '';
  
  return (
    <section id={id} className={`py-12 md:py-16 ${className}`}>
      <div className={containerClasses}>
        {(title || subtitle) && (
          <div className={`mb-12 ${centered ? 'text-center' : ''}`}>
            {title && <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-3">{title}</h2>}
            {subtitle && <p className="text-xl text-gray-500 dark:text-gray-400">{subtitle}</p>}
          </div>
        )}
        
        <div className={contentClasses}>
          {children}
        </div>
      </div>
    </section>
  );
}