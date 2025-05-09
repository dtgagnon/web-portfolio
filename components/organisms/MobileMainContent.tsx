// components/organisms/MobileMainContent.tsx
import React from 'react';
import Image from 'next/image';

interface MobileMainContentProps {
  name: string;
  email: string;
  profileImageUrl: string;
  profileImageAlt: string;
  AboutMeBlurbComponent: React.ElementType;
  SocialLinksComponent: React.ElementType;
  ContactInfoComponent: React.ElementType; // Added for consistency, might hold only the name
}

const MobileMainContent: React.FC<MobileMainContentProps> = ({
  name,
  email,
  profileImageUrl,
  profileImageAlt,
  AboutMeBlurbComponent,
  SocialLinksComponent,
  ContactInfoComponent, // To render the name centrally at the top
}) => {
  return (
    <div className="flex flex-col items-center text-center w-full px-4" data-testid="mobile-main-content">
      {/* Render ContactInfo with only name for mobile, showEmail will be false */}
      <ContactInfoComponent name={name} email={email} showEmail={false} className="mb-6" />
      
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

      <div className="mb-6 max-w-prose">
        <AboutMeBlurbComponent isMobileLayout={true} />
      </div>

      <hr className="w-2/3 border-t border-dotted border-gray-400 dark:border-gray-600 my-6" data-testid="mobile-layout-border" />

      <div className="mt-auto">
        <SocialLinksComponent />
      </div>
    </div>
  );
};

export default MobileMainContent;
