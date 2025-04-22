import React from 'react';
import { Logo } from '@/components/atoms';
import { NavLink } from '@/components/molecules';

interface NavbarProps {
  className?: string;
}

export default function Navbar({ className = '' }: NavbarProps) {
  return (
    <nav className={`flex justify-between items-center w-full py-4 px-4 md:px-8 ${className}`}>
      <Logo href="/" withText />
      
      <div className="flex items-center gap-6 md:gap-8">
        <NavLink href="/about">About</NavLink>
        <NavLink href="/projects">Projects</NavLink>
        <NavLink href="/resume">Resume</NavLink>
      </div>
    </nav>
  );
}