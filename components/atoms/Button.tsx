import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  ariaLabel?: string;
}

export default function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  type = 'button',
  ariaLabel,
}: ButtonProps) {
  // Base styles all buttons share
  const baseStyles = "font-medium rounded transition-colors focus:outline-none focus:ring-2 focus:ring-opacity-50";
  
  // Variant-specific styles
  const variantStyles = {
    primary: "bg-[#7cbddb] text-black hover:bg-sky-600 focus:ring-sky-500",
    secondary: "bg-pink text-black hover:bg-pink-600 focus:ring-pink-500",
    outline: "bg-transparent border border-current text-current hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-current",
    ghost: "bg-transparent text-current hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-current"
  };
  
  // Size-specific styles
  const sizeStyles = {
    sm: "py-1 px-3 text-sm",
    md: "py-2 px-4 text-base",
    lg: "py-3 px-6 text-lg"
  };
  
  // Combine all styles
  const buttonStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`;
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonStyles}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}