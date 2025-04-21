import React from 'react';

interface IconLinkProps {
  href: string;
  label: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
  onClick?: () => void;
}

export default function IconLink({
  href,
  label,
  children,
  className = '',
  external = true,
  onClick,
}: IconLinkProps) {
  // External link attributes for security and UX
  const externalProps = external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};
    
  return (
    <a 
      href={href} 
      aria-label={label}
      className={`inline-flex items-center justify-center text-current hover:text-gray-700 dark:hover:text-gray-300 transition-colors ${className}`}
      onClick={onClick}
      {...externalProps}
    >
      {children}
    </a>
  );
}