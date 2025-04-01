'use client'

import React, { useState, useEffect, useRef } from 'react';
import ResumeContent from './ResumeContent';
import { useDarkMode } from '@/components/context/DarkModeContext';

export default function Resume({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (isOpen: boolean) => void }) {
  const resumeRef = useRef<HTMLDivElement>(null);
  const { isDarkMode } = useDarkMode();

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
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
      }}
    >
      <div 
        ref={resumeRef}
        className="w-full max-w-6xl h-[calc(100vh-4rem)] overflow-auto rounded-lg shadow-xl"
        style={{ 
          aspectRatio: '8.5/11', // Letter paper ratio (portrait)
          backgroundColor: isDarkMode ? '#1c1c1c' : 'white',
          color: isDarkMode ? '#faf8f2' : '#1c1c1c'
        }}
      >
        <div className="sticky top-0 flex justify-end p-2 border-b"
          style={{
            backgroundColor: isDarkMode ? '#1c1c1c' : 'white',
            borderColor: isDarkMode ? '#374151' : '#e5e7eb'
          }}
        >
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-full"
            style={{
              backgroundColor: isDarkMode ? '#2d3748' : '#f3f4f6',
              color: isDarkMode ? '#faf8f2' : '#1c1c1c'
            }}
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-8">
          <ResumeContent />
        </div>
      </div>
    </div>
  );
}