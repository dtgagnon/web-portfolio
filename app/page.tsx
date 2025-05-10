'use client';

import React from 'react';
import Image from 'next/image';
import ContactInfo from '@/components/molecules/ContactInfo';
import AboutMeBlurb from '@/components/molecules/AboutMeBlurb';
import SocialLinks from '@/components/molecules/SocialLinks';
import ChatCard from '@/components/organisms/chat/ChatCard'; 
import { MainContent, Navbar } from '@/components/organisms';

const NAME = 'Derek Gagnon';
const EMAIL = 'gagnon.derek@protonmail.com';
const PROFILE_IMAGE_URL = '/images/profile.jpg';
const PROFILE_IMAGE_ALT = 'Picture of Derek Gagnon';

export default function Home() {

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
        <Navbar className="w-full" />
      </header>

      <main className="flex-grow flex flex-col items-center justify-center py-12 md:py-20 px-4">
        <MainContent {...mainContentProps} />
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