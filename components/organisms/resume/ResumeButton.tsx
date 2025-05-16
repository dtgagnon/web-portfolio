'use client';

import React, { useState } from 'react';
import ResumeCard from './ResumeCard';

export default function ResumeButton() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenResume = () => {
    console.log('Opening resume modal');
    setIsOpen(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpenResume}
        className="bg-transparent border-0 p-0 m-0 cursor-pointer transition-colors hover:text-sky-600 dark:hover:text-sky-400 text-inherit font-medium text-base"
        aria-label="View Resume"
        data-testid="resume-button"
      >
        Resume
      </button>
      
      {/* Include the modal directly in this component */}
      <ResumeCard isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
}
