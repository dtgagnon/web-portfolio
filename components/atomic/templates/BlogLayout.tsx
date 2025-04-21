import React from 'react';
import { MainLayout } from '@/components/atomic/templates';
import Image from 'next/image';

interface BlogLayoutProps {
  children: React.ReactNode;
  title: string;
  date: string;
  author?: {
    name: string;
    image?: string;
  };
  coverImage?: string;
  tags?: string[];
  readTime?: string;
  className?: string;
}

export default function BlogLayout({
  children,
  title,
  date,
  author = { name: 'Derek Gagnon' },
  coverImage,
  tags = [],
  readTime = '5 min read',
  className = ''
}: BlogLayoutProps) {
  // Format date
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <MainLayout>
      <article>
        {/* Blog header */}
        <header className="relative">
          {coverImage && (
            <div className="h-64 sm:h-80 md:h-96 relative">
              <Image
                src={coverImage}
                alt={title}
                fill
                style={{ objectFit: 'cover' }}
                priority
                className="opacity-90"
              />
              <div className="absolute inset-0 bg-black/50" />
            </div>
          )}
          
          <div className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 ${coverImage ? 'relative -mt-32 mb-12' : 'py-12'}`}>
            <div className={`${coverImage ? 'bg-white dark:bg-black p-8 rounded-lg shadow-lg' : ''}`}>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {tags.map((tag) => (
                    <span 
                      key={tag}
                      className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
                {title}
              </h1>
              
              <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm gap-4">
                {author && (
                  <div className="flex items-center">
                    {author.image && (
                      <div className="relative h-8 w-8 rounded-full overflow-hidden mr-2">
                        <Image
                          src={author.image}
                          alt={author.name}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                    )}
                    <span>{author.name}</span>
                  </div>
                )}
                
                <time dateTime={date}>{formattedDate}</time>
                
                {readTime && (
                  <span>{readTime}</span>
                )}
              </div>
            </div>
          </div>
        </header>
        
        {/* Blog content */}
        <div className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 prose dark:prose-invert prose-lg ${className}`}>
          {children}
        </div>
      </article>
    </MainLayout>
  );
}