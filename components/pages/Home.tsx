// components/pages/Home.tsx
'use client';

import React from 'react';
import { MainContent } from '@/components/organisms';
import ContactInfo from '@/components/molecules/ContactInfo';
import AboutMeBlurb from '@/components/molecules/AboutMeBlurb';
import SocialLinks from '@/components/molecules/SocialLinks';

const NAME = 'Derek Gagnon';
const EMAIL = 'gagnon.derek@protonmail.com';
const PROFILE_IMAGE_URL = '/images/profile.jpg'; // Consistent with former app/page.tsx
const PROFILE_IMAGE_ALT = 'Picture of Derek Gagnon';

// This component is imported into app/page.tsx via components/pages/index.ts
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

  return <MainContent {...mainContentProps} />;
}