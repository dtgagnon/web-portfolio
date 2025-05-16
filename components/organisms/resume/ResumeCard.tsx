'use client'

import React from 'react';
import FullScreenModal from '@/components/molecules/FullScreenModal';
import ResumeContent from './ResumeContent';

interface ResumeCardProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function ResumeCard({ isOpen, setIsOpen }: ResumeCardProps) {
  const handleClose = () => setIsOpen(false);

  return (
    <FullScreenModal 
      isOpen={isOpen} 
      onClose={handleClose}
      className="max-w-6xl w-full h-[90vh] overflow-auto"
    >
      <ResumeContent />
    </FullScreenModal>
  );
}