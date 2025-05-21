import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Home as HomePageContent } from '@/components/pages'; // Testing the refactored component
import { ThemeProvider } from '@/providers/ThemeContext';

// Mock the direct child MainContent to check props
vi.mock('@/components/organisms', async (importOriginal) => {
  const original = await importOriginal<typeof import('@/components/organisms')>();
  return {
    ...original,
    MainContent: vi.fn(() => <div data-testid="main-content-mock">MainContent Mock</div>),
  };
});

// Mock molecule components just to verify they are passed as props
// These paths are relative to the test file or aliased paths from tsconfig
vi.mock('@/components/molecules/ContactInfo', () => ({
  default: () => <div data-testid="contact-info-mock">ContactInfo Mock</div>,
}));
vi.mock('@/components/molecules/AboutMeBlurb', () => ({
  default: () => <div data-testid="about-me-blurb-mock">AboutMeBlurb Mock</div>,
}));
vi.mock('@/components/molecules/SocialLinks', () => ({
  default: () => <div data-testid="social-links-mock">SocialLinks Mock</div>,
}));

// Import the mocked MainContent to assert calls
import { MainContent } from '@/components/organisms';
// Import the actual molecule components to compare references for props
import ContactInfo from '@/components/molecules/ContactInfo';
import AboutMeBlurb from '@/components/molecules/AboutMeBlurb';
import SocialLinks from '@/components/molecules/SocialLinks';


describe('HomePageContent Component (components/pages/Home.tsx)', () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Clear mocks before each test
    render(
      <ThemeProvider>
        <HomePageContent />
      </ThemeProvider>
    );
  });

  it('renders the MainContent component', () => {
    expect(screen.getByTestId('main-content-mock')).toBeInTheDocument();
  });

  it('passes the correct static props to MainContent', () => {
    expect(MainContent).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Derek Gagnon',
        email: 'gagnon.derek@protonmail.com',
        profileImageUrl: '/images/profile.jpg',
        profileImageAlt: 'Picture of Derek Gagnon',
      }),
      undefined // Expect the second argument to be undefined
    );
  });

  it('passes the correct component references as props to MainContent', () => {
    expect(MainContent).toHaveBeenCalledWith(
      expect.objectContaining({
        ContactInfoComponent: ContactInfo,
        AboutMeBlurbComponent: AboutMeBlurb,
        SocialLinksComponent: SocialLinks,
      }),
      undefined // Expect the second argument to be undefined
    );
  });
});
