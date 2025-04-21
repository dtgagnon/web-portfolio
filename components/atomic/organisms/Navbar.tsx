import React, { useState } from 'react';
import { Logo } from '@/components/atomic/atoms';
import { NavLink, SocialLinks } from '@/components/atomic/molecules';

interface NavbarProps {
  className?: string;
}

export default function Navbar({ className = '' }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <header className={`sticky top-0 z-50 bg-white/90 dark:bg-black/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Logo href="/" withText />
          
          {/* Desktop navigation */}
          <nav className="hidden md:flex space-x-8">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/projects">Projects</NavLink>
            <NavLink href="/about">About</NavLink>
            <NavLink href="/contact">Contact</NavLink>
          </nav>
          
          <div className="hidden md:flex items-center space-x-4">
            <SocialLinks direction="row" iconSize="sm" />
          </div>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 rounded-md text-gray-400 hover:text-black hover:bg-gray-100 dark:hover:text-white dark:hover:bg-gray-800"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
          >
            <span className="sr-only">{isMenuOpen ? 'Close menu' : 'Open menu'}</span>
            {/* Menu icon */}
            {!isMenuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile menu, show/hide based on menu state */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200 dark:border-gray-800">
            <NavLink href="/" className="block px-3 py-2 rounded-md">Home</NavLink>
            <NavLink href="/projects" className="block px-3 py-2 rounded-md">Projects</NavLink>
            <NavLink href="/about" className="block px-3 py-2 rounded-md">About</NavLink>
            <NavLink href="/contact" className="block px-3 py-2 rounded-md">Contact</NavLink>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-800">
            <div className="px-5 flex justify-center">
              <SocialLinks direction="row" iconSize="sm" />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}