'use client';

import React, { useState } from 'react';
import ProjectCarousel from './ProjectCarousel';
import FullScreenModal from '@/components/molecules/FullScreenModal'; // Import FullScreenModal

export default function ProjectsButton() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenProjects = () => {
    console.log('Opening projects modal');
    setIsOpen(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpenProjects}
        className="bg-transparent border-0 p-0 m-0 cursor-pointer transition-colors hover:text-sky-600 dark:hover:text-sky-400 text-inherit font-medium text-base"
        aria-label="View Projects"
        data-testid="projects-button"
      >
        Projects
      </button>
      
      {/* Include the modal directly in this component */}
      <FullScreenModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ProjectCarousel />
      </FullScreenModal>
    </>
  );
}
