import React from 'react';

interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url';
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  error?: string;
  autoComplete?: string;
}

export default function Input({
  type = 'text',
  id,
  name,
  value,
  onChange,
  placeholder = '',
  label,
  required = false,
  disabled = false,
  className = '',
  error,
  autoComplete,
}: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label 
          htmlFor={id}
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        autoComplete={autoComplete}
        className={`px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent ${error ? 'border-red-500 focus:ring-red-500' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        aria-invalid={error ? 'true' : 'false'}
      />
      
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  );
}