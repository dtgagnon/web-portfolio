import React, { useState } from 'react';
import About from '@/components/organisms/About';
import FullScreenModal from './FullScreenModal';

interface AboutMeBlurbProps {
  className?: string;
}

export default function AboutMeBlurb({ className = '' }: AboutMeBlurbProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className={`${className}`}>
      <div className="space-y-4">
        <p className="text-lg">
          Hi! I'm a medical device engineer who has become a bit of an everything engineer.
          I'm passionate about creating innovative solutions that improve healthcare outcomes
          through thoughtful design and robust engineering.
        </p>
        <div className="flex justify-end">
          <button
            onClick={openModal}
            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium flex items-center"
            aria-label="More about me"
          >
            More about me
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </button>
        </div>
      </div>

      <FullScreenModal
        isOpen={isModalOpen}
        onClose={closeModal}
      >
        <About />
      </FullScreenModal>
    </div>
  );
}
