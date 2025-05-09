import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/atoms';

interface HeroProps {
  title: string;
  subtitle?: string;
  imageSrc?: string;
  ctaText?: string;
  ctaLink?: string;
  className?: string;
  imagePosition?: 'left' | 'right';
}

export default function Hero({
  title,
  subtitle,
  imageSrc = '/images/profile.jpg',
  ctaText = 'View Projects',
  ctaLink = '/projects',
  className = '',
  imagePosition = 'right'
}: HeroProps) {
  return (
    <section className={`py-12 md:py-24 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${imagePosition === 'left' ? 'md:flex-row-reverse' : ''}`}>
          {/* Text content */}
          <div className="flex flex-col">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              {title}
            </h1>
            
            {subtitle && (
              <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">
                {subtitle}
              </p>
            )}
            
            <div className="mt-8">
              <Button 
                onClick={() => window.location.href = ctaLink}
                variant="primary"
                size="lg"
              >
                {ctaText}
              </Button>
            </div>
          </div>
          
          {/* Image */}
          <div className="flex justify-center">
            {imageSrc && (
              <div className="relative h-64 w-64 md:h-80 md:w-80 rounded-full overflow-hidden">
                <Image
                  src={imageSrc}
                  alt="Derek headshot image"
                  fill
                  style={{ objectFit: 'cover' }}
                  priority
                  className="rounded-full"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}