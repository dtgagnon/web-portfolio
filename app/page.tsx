// app/page.tsx
'use client';

import React from 'react'; // Removed useState
// Import the refactored Home component (which acts as content) from components/pages
import { Home as HomePageContent } from '@/components/pages';
import { Navbar } from '@/components/organisms';
// Removed ProjectCarousel and FullScreenModal imports
import ChatCard from '@/components/organisms/chat/ChatCard'; // Retain for footer structure

// This 'Home' is the Next.js page route component
export default function Home() {
  // Removed modal state and handlers

  return (
    <div className="flex flex-col min-h-screen font-[family-name:var(--font-geist-sans)]">
      <header className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700">
        <Navbar className="w-full" />
      </header>

      <main className="flex-grow flex flex-col items-center justify-center py-12 md:py-20 px-4">
        {/* Render the imported content component */}
        <HomePageContent />
        
        {/* Removed button and FullScreenModal with ProjectCarousel */}
      </main>

      <footer className="flex items-center justify-between px-4 py-3">
        <div className="flex w-1/3 justify-start">
          <p className="text-xs text-gray-500 dark:text-gray-400"> {new Date().getFullYear()} Derek Gagnon</p>
        </div>
        <div className="flex w-1/3 justify-center">
          <ChatCard content="" />
        </div>
        <div className="flex w-1/3 justify-end">
          <p className="text-xs text-gray-500 dark:text-gray-400">All rights reserved</p>
        </div>
      </footer>
    </div>
  );
}