import React from 'react';
import { Logo } from '@/components/atoms';
import { NavLink } from '@/components/molecules';
import ResumeButton from './resume/ResumeButton';
import ProjectsButton from './projects/ProjectsButton'; // Added ProjectsButton import
import ThemeToggle from '@/components/atoms/ThemeToggle';

interface NavbarProps {
  className?: string;
}

export default function Navbar({ className = '' }: NavbarProps) {
  return (
    <nav className={`flex justify-between items-center w-full py-4 px-4 md:px-8 ${className}`}>
      <Logo href="/" withText={false} />
      
      <div className="flex items-center gap-6 md:gap-8">
        <ThemeToggle />
        <NavLink href="/about">About</NavLink>
        <ProjectsButton />
        <ResumeButton />
      </div>
    </nav>
  );
}