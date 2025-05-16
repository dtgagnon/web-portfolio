import React from 'react';
import { IconLink } from '@/components/atoms';

interface ContactInfoProps {
  name: string;
  email: string;
  className?: string;
  showLabel?: boolean;
  showEmail?: boolean;
}

export default function ContactInfo({
  name,
  email,
  className = '',
  showLabel = false,
  showEmail = false
}: ContactInfoProps) {
  return (
    <div className={`flex flex-col ${className}`}>
      <h2 className="text-2xl font-semibold">{name}</h2>
      
      {showEmail && (
        <div className="text-sm font-[family-name:var(--font-geist-mono)]">
          {showLabel && <span className="text-gray-500 mr-2">Email:</span>}
          <a 
            href={`mailto:${email}`} 
            className="hover:border-b border-dashed"
            aria-label={`Send email to ${name}`}
          >
            {email}
          </a>
        </div>
      )}
    </div>
  );
}