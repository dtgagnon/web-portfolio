import React from 'react';

type BadgeProps = {
  variant?: 'default' | 'secondary' | 'outline' | 'destructive';
  className?: string;
  children: React.ReactNode;
};

export const Badge = ({
  variant = 'default',
  className = '',
  children,
}: BadgeProps) => {
  // Simple base styles that will work reliably
  const baseStyles = 'inline-block rounded-full px-2.5 py-1 text-xs font-medium';
  
  // Simplified variant styles using common Tailwind classes
  const variantStyles = {
    default: 'bg-primary text-primary-foreground',
    secondary: 'bg-gray-100 text-gray-800',
    outline: 'bg-transparent border border-gray-300',
    destructive: 'bg-red-500 text-white',
  };

  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
