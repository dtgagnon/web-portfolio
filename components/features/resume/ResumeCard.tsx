'use client'

import React, { useState, useEffect, useRef } from 'react';
import ResumeContent from './ResumeContent';

export default function Resume({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (isOpen: boolean) => void }) {
  const resumeRef = useRef<HTMLDivElement>(null);

  // Close on escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsOpen]);

  // Close when clicking outside the resume
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (resumeRef.current && !resumeRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, setIsOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/50 flex items-center justify-center z-50 p-4">
      <div 
        ref={resumeRef}
        className="bg-white text-dark dark:bg-dark dark:text-cream w-full max-w-6xl h-[calc(100vh-4rem)] overflow-auto rounded-lg shadow-xl"
        style={{ aspectRatio: '8.5/11' }} // Letter paper ratio (portrait)
      >
        <div className="sticky top-0 flex justify-end p-2 bg-white text-dark dark:bg-dark dark:text-cream border-b border-gray-200 dark:border-gray-700">
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-dark dark:text-cream"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <ResumeContent />
      </div>
    </div>
  );
}