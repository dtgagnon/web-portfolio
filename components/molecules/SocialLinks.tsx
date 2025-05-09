import React from 'react';
import { IconLink } from '@/components/atoms';
import { LinkedInIcon, GitHubIcon, EmailIcon } from '@/components/atoms/icons';

interface SocialLinksProps {
  className?: string;
  direction?: 'row' | 'column';
  iconSize?: 'sm' | 'md' | 'lg';
  email?: string;
}

export default function SocialLinks({
  className = '',
  direction = 'row',
  iconSize = 'md',
  email = 'gagnon.derek@protonmail.com'
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
      <IconLink href={`mailto:${email}`} label="Email Me">
        <EmailIcon className={sizeClass} />
      </IconLink>

      <IconLink href="https://linkedin.com/in/derek-gagnon" label="LinkedIn Profile">
        <LinkedInIcon className={sizeClass} />
      </IconLink>
      
      <IconLink href="https://github.com/dtgagnon" label="GitHub Profile">
        <GitHubIcon className={sizeClass} />
      </IconLink>
    </div>
  );
}