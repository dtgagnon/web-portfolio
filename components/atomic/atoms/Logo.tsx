import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  href?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  withText?: boolean;
}

export default function Logo({
  href = '/',
  size = 'md',
  className = '',
  withText = false
}: LogoProps) {
  // Size values in pixels for different size options
  const sizes = {
    sm: 40,
    md: 60,
    lg: 80
  };
  
  const imageSize = sizes[size];
  
  // Logo component
  const logoContent = (
    <div className={`relative flex items-center gap-3 ${className}`}>
      <div className="relative group">
        <Image
          src="/images/derek-logo.jpg"
          alt="Derek's Logo"
          width={imageSize}
          height={imageSize}
          priority
          className="transition-opacity duration-300 ease-in-out z-10 group-hover:opacity-0"
        />
        <Image
          src="/images/logo-ani-0.jpeg" 
          alt="Logo Hover Effect"
          width={imageSize}
          height={imageSize}
          priority
          className="absolute top-0 left-0 transition-opacity duration-300 ease-in-out opacity-0 group-hover:opacity-100"
        />
      </div>
      
      {withText && (
        <span className="font-semibold text-xl text-current">
          Derek Gagnon
        </span>
      )}
    </div>
  );
  
  // If a link is needed, wrap in Link component
  if (href) {
    return (
      <Link href={href} className="focus:outline-none focus:ring-2 focus:ring-sky-500 rounded-md">
        {logoContent}
      </Link>
    );
  }
  
  // Otherwise just return the logo itself
  return logoContent;
}