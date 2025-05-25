import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'outline' | 'destructive';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'default',
  className = ''
}) => {
  // Base styles for all badges - following accessibility guidelines for text size
  const baseStyles = 'inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2';
  
  // Variant-specific styles
  const variantStyles = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/80',
    secondary: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600',
    outline: 'bg-transparent border border-gray-300 text-gray-700 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800',
    destructive: 'bg-red-500 text-white hover:bg-red-600'
  };

  return (
    <span 
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      role="status"
    >
      {children}
    </span>
  );
};

export default Badge;
