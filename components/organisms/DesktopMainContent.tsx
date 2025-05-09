// components/organisms/DesktopMainContent.tsx
import React from 'react';
import Image from 'next/image';

interface DesktopMainContentProps {
  name: string;
  email: string;
  profileImageUrl: string;
  profileImageAlt: string;
  AboutMeBlurbComponent: React.ElementType;
  SocialLinksComponent: React.ElementType;
  ContactInfoComponent: React.ElementType;
}

const DesktopMainContent: React.FC<DesktopMainContentProps> = ({
  name,
  email,
  profileImageUrl,
  profileImageAlt,
  AboutMeBlurbComponent,
  SocialLinksComponent,
  ContactInfoComponent,
}) => {
  return (
    <div className="flex items-start justify-center w-full space-x-8 px-4 relative" data-testid="desktop-main-content">
      {/* Left Column: Contact Info and Social Links with upward offset */}
      <div 
        className="w-1/4 flex flex-col items-start text-left pt-10 transform translate-y-12 space-y-6"
        data-testid="desktop-left-column"
      >
        <ContactInfoComponent name={name} email={email} showEmail={false} className="text-left" />
        <hr className="w-full border-t border-dotted border-gray-400 dark:border-gray-600" data-testid="desktop-column-border" />
        <SocialLinksComponent className="self-start" />
      </div>

      {/* Center Column: Profile Image - aligned with the top of the viewport, not offset */}
      <div 
        className="w-1/2 flex justify-center items-start pt-10"
        data-testid="desktop-center-column"
      >
        <div className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 relative rounded-full overflow-hidden shadow-lg">
          <Image
            src={profileImageUrl}
            alt={profileImageAlt}
            fill
            style={{ objectFit: 'cover' }}
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </div>

      {/* Right Column: About Me Blurb */}
      <div className="w-1/3 pt-16 relative" data-testid="desktop-about-blurb-column">
        <AboutMeBlurbComponent className="text-left" isMobileLayout={false} />
        <div className="absolute bottom-0 left-0 w-full h-px border-b border-dotted border-gray-400 dark:border-gray-600 -mb-8"></div>
      </div>
    </div>
  );
};

export default DesktopMainContent;
