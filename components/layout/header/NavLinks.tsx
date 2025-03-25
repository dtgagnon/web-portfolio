'use client'

import { useState } from 'react';
import ResumeCard from '@/components/features/resume/ResumeCard';

export default function NavLinks() {
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  return (
    <div>
      <ResumeCard isOpen={isResumeOpen} setIsOpen={setIsResumeOpen} />
      <nav>
        <ul className="flex gap-4 font-[family-name:var(--font-geist-sans)]">
          <li><a href="#about" className="hover:underline">About</a></li>
          <li><a href="#projects" className="hover:underline">Projects</a></li>
          <li><button onClick={() => setIsResumeOpen(true)} className="hover:underline">Resume</button></li>
        </ul>
      </nav>
    </div>
  );
}