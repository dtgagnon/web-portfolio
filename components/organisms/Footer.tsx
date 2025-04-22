import React from 'react';
import { Logo } from '@/components/atoms';
import { NavLink, SocialLinks } from '@/components/molecules';

interface FooterProps {
  className?: string;
}

export default function Footer({ className = '' }: FooterProps) {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={`bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left column: Logo and tagline */}
          <div className="flex flex-col">
            <Logo withText size="sm" />
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Medical device engineer turned everything engineer, passionate about creating innovative solutions.
            </p>
          </div>
          
          {/* Middle column: Navigation links */}
          <div className="flex flex-col">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Navigation</h3>
            <div className="mt-4 space-y-2">
              <NavLink href="/" className="text-sm block">Home</NavLink>
              <NavLink href="/projects" className="text-sm block">Projects</NavLink>
              <NavLink href="/about" className="text-sm block">About</NavLink>
              <NavLink href="/contact" className="text-sm block">Contact</NavLink>
            </div>
          </div>
          
          {/* Right column: Connect */}
          <div className="flex flex-col">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Connect</h3>
            <div className="mt-4">
              <SocialLinks direction="column" iconSize="sm" />
            </div>
          </div>
        </div>
        
        {/* Bottom copyright */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-center text-xs text-gray-500 dark:text-gray-400">
            © {currentYear} Derek Gagnon. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}