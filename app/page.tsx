'use client';

import React from 'react';
import Image from 'next/image';
import ContactInfo from '@/components/molecules/ContactInfo';
import AboutMeBlurb from '@/components/molecules/AboutMeBlurb';
import SocialLinks from '@/components/molecules/SocialLinks';
import NavLink from '@/components/molecules/NavLink'; 
import ChatCard from '@/components/organisms/chat/ChatCard'; 
import useBreakpoint from '@/lib/hooks/useBreakpoint'; 
import MobileMainContent from '@/components/organisms/MobileMainContent'; 
import DesktopMainContent from '@/components/organisms/DesktopMainContent'; 

const NAME = 'Derek Gagnon';
const EMAIL = 'gagnon.derek@protonmail.com';
const PROFILE_IMAGE_URL = '/images/profile.jpg';
const PROFILE_IMAGE_ALT = 'Picture of Derek Gagnon';
const BREAKPOINT_PX = 768;

export default function Home() {
  const isMobile = useBreakpoint(BREAKPOINT_PX);

  const mainContentProps = {
    name: NAME,
    email: EMAIL,
    profileImageUrl: PROFILE_IMAGE_URL,
    profileImageAlt: PROFILE_IMAGE_ALT,
    ContactInfoComponent: ContactInfo,
    AboutMeBlurbComponent: AboutMeBlurb,
    SocialLinksComponent: SocialLinks,
  };

  return (
    <div className="flex flex-col min-h-screen font-[family-name:var(--font-geist-sans)]">
      <header className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700">
        <div className="flex w-1/3 justify-start relative group">
          {/* Placeholder for Logo - Assuming paths, adjust if needed */}
          <Image
            src="/images/derek-logo.jpg" 
            alt="Logo"
            width={80}
            height={80}
            priority
            className="transition-opacity duration-300 ease-in-out z-10 group-hover:opacity-0"
          />
          <Image
            src="/images/logo-ani-0.jpeg"
            alt="Logo Hover"
            width={80}
            height={80}
            priority
            className="absolute top-0 left-0 transition-opacity duration-300 ease-in-out opacity-0 group-hover:opacity-100"
          />
        </div>

        <div className="flex w-1/3 justify-center">
          {/* Optional: Centered header content if any */}
        </div>

        <div className="flex w-1/3 justify-end">
          <nav className="flex space-x-4">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/about">About</NavLink> 
            <NavLink href="/projects">Projects</NavLink> 
            <NavLink href="/contact">Contact</NavLink> 
          </nav>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center py-12 md:py-20 px-4">
        {isMobile ? (
          <MobileMainContent {...mainContentProps} />
        ) : (
          <DesktopMainContent {...mainContentProps} />
        )}
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