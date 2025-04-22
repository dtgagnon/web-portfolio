import React from 'react';
import { MainLayout } from '@/components/templates';
import { ChatCard } from '@/components/organisms/chat';
import { SocialLinks } from '@/components/molecules';
import Image from 'next/image';

export default function Home() {
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center min-h-screen px-8">
        <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-6xl">
          {/* Left side - Name and Email */}
          <div className="flex flex-col mb-8 md:mb-0 text-left">
            <h1 className="text-4xl font-bold mb-2">Derek Gagnon</h1>
            <span className="text-gray-300">gagnon.derek@protonmail.com</span>
          </div>
          
          {/* Center - Profile Image */}
          <div className="relative w-52 h-52 rounded-full overflow-hidden mx-4 my-6 md:my-0">
            <Image
              src="/profile.jpg"
              alt="Derek Gagnon"
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>
          
          {/* Right side - Bio */}
          <div className="max-w-md text-right">
            <p className="text-lg">
              Hi! I'm a medical device engineer who has become a bit of an
              everything engineer.
            </p>
            <p className="mt-2">
              I'm passionate about creating innovative solutions that improve
              healthcare outcomes through thoughtful design and robust
              engineering.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}