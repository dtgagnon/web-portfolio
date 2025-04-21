import React from 'react';
import { IconLink } from '@/components/atomic/atoms';
import { LinkedInIcon, GitHubIcon } from '@/components/atomic/atoms/icons'; // You'll need to create these

interface SocialLinksProps {
  className?: string;
  direction?: 'row' | 'column';
  iconSize?: 'sm' | 'md' | 'lg';
}

export default function SocialLinks({
  className = '',
  direction = 'row',
  iconSize = 'md'
}: SocialLinksProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };
  
  const sizeClass = sizes[iconSize];
  const containerClass = direction === 'row' ? 'flex flex-row space-x-4' : 'flex flex-col space-y-4';
  
  return (
    <div className={`${containerClass} ${className}`}>
      <IconLink href="[https://linkedin.com/in/derek-gagnon"](https://linkedin.com/in/derek-gagnon") label="LinkedIn Profile">
        <LinkedInIcon className={sizeClass} />
      </IconLink>
      
      <IconLink href="[https://github.com/dtgagnon"](https://github.com/dtgagnon") label="GitHub Profile">
        <GitHubIcon className={sizeClass} />
      </IconLink>
      
      {/* Add more social links as needed */}
    </div>
  );
}