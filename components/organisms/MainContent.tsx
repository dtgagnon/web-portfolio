// components/organisms/MainContent.tsx
import React from 'react';
import { ProfileImage } from '@/components/atoms';
import Image from 'next/image';

interface MainContentProps {
  name: string;
  email: string;
  profileImageUrl: string;
  profileImageAlt: string;
  AboutMeBlurbComponent: React.ElementType;
  SocialLinksComponent: React.ElementType;
  ContactInfoComponent: React.ElementType;
}

const MainContent: React.FC<MainContentProps> = ({
  name,
  email,
  profileImageUrl,
  profileImageAlt,
  AboutMeBlurbComponent,
  SocialLinksComponent,
  ContactInfoComponent,
}) => {
  return (
    <>
      {/* Mobile layout (default) that transforms at md breakpoint */}
      <div className="flex flex-col md:hidden items-center text-center w-full px-4" data-testid="mobile-view">
        {/* Contact info */}
        <ContactInfoComponent name={name} email={email} showEmail={false} className="mb-6" />
        
        {/* Profile image */}
        <div className="mb-6 w-48 h-48 relative rounded-full overflow-hidden shadow-lg">
          <Image
            src={profileImageUrl}
            alt={profileImageAlt}
            fill
            style={{ objectFit: 'cover' }}
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* About me section */}
        <div className="mb-6 max-w-prose">
          <AboutMeBlurbComponent className="" />
        </div>

        <hr className="w-2/3 border-t border-dotted border-gray-400 dark:border-gray-600 -mt-1 mb-6" data-testid="mobile-layout-border" />

        {/* Social links */}
        <div className="mt-auto">
          <SocialLinksComponent />
        </div>
      </div>

      {/* Desktop layout - hidden on small screens, visible from md breakpoint */}
      <div className="hidden md:flex items-start justify-center w-full space-x-8 px-4 relative" data-testid="desktop-view">
        {/* Left Column: Contact Info and Social Links with upward offset */}
        <div 
          className="w-1/4 flex flex-col items-start text-left transform translate-y-48 space-y-2"
          data-testid="desktop-left-column"
        >
          <ContactInfoComponent name={name} email={email} showEmail={false} className="self-center text-center" />
          <hr className="w-full border-t border-dotted border-gray-400 dark:border-gray-600" data-testid="desktop-column-border" />
          <SocialLinksComponent className="self-center" />
        </div>

        {/* Center Column: Profile Image */}
        <div 
          className="w-1/2 flex justify-center items-start pt-10"
          data-testid="desktop-center-column"
        >
          <ProfileImage
            src={profileImageUrl}
            alt={profileImageAlt}
            priority
            size="lg"
          />
        </div>

        {/* Right Column: About Me Blurb */}
        <div className="w-1/3 pt-16 relative space-y-2" data-testid="desktop-about-blurb-column">
          <AboutMeBlurbComponent className="text-left" />
          <hr className="w-full border-t border-dotted border-gray-400 dark:border-gray-600" data-testid="desktop-about-blurb-border" />
        </div>
      </div>
    </>
  );
};

export default MainContent;
