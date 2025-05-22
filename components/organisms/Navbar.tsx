import React, { useState } from 'react';
import { Logo } from '@/components/atoms';
import { NavLink } from '@/components/molecules';
import ResumeButton from './resume/ResumeButton';
import ThemeToggle from '@/components/atoms/ThemeToggle';
import FullScreenModal from '@/components/molecules/FullScreenModal';
import ProjectCarousel from '@/components/organisms/ProjectCarousel';

interface NavbarProps {
  className?: string;
}

export default function Navbar({ className = '' }: NavbarProps) {
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  const openProjectModal = () => setIsProjectModalOpen(true);
  const closeProjectModal = () => setIsProjectModalOpen(false);

  return (
    <>
      <nav className={`flex justify-between items-center w-full py-4 px-4 md:px-8 ${className}`}>
        <Logo href="/" withText={false} />
        
        <div className="flex items-center gap-6 md:gap-8">
          <ThemeToggle />
          <NavLink href="/about">About</NavLink>
          {/* Updated Projects link to be a button */}
          <button
            onClick={openProjectModal}
            className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-150"
            aria-label="Open projects carousel"
          >
            Projects
          </button>
          <ResumeButton />
        </div>
      </nav>

      <FullScreenModal isOpen={isProjectModalOpen} onClose={closeProjectModal}>
        <ProjectCarousel />
      </FullScreenModal>
    </>
  );
}