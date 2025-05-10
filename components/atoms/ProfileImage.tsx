import React from 'react';
import Image from 'next/image';

interface ProfileImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  size?: 'sm' | 'md' | 'lg';
  shadowed?: boolean;
}

/**
 * ProfileImage component for displaying user profile pictures with consistent sizing across breakpoints
 * 
 * @param src - The source URL of the image
 * @param alt - Alt text for accessibility
 * @param className - Optional additional classes
 * @param priority - Whether the image should be prioritized for loading
 * @param size - Size variant (sm, md, lg) that controls dimensions across breakpoints
 * @param shadowed - Whether to apply shadow styling (default: true)
 */
export default function ProfileImage({
  src,
  alt,
  className = '',
  priority = false,
  size = 'md',
  shadowed = true
}: ProfileImageProps) {
  const sizeClasses = {
    sm: 'w-48 h-48 sm:w-48 sm:h-48',
    md: 'w-64 h-64 sm:w-64 sm:h-64',
    lg: 'w-80 h-80 sm:w-80 sm:h-80'
  };

  // Combine all the classes for the container
  const containerClasses = [
    sizeClasses[size],
    'relative rounded-full overflow-hidden',
    shadowed ? 'shadow-lg' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={containerClasses}
      data-testid="profile-image-container"
    >
      <Image
        src={src}
        alt={alt}
        fill
        style={{ objectFit: 'cover' }}
        priority={priority}
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="rounded-full"
      />
    </div>
  );
}
