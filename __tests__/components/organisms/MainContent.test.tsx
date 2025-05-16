import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MainContent from '@/components/organisms/MainContent';

// Mock the required child components
const MockAboutMeBlurb = ({ className }: { className?: string }) => (
  <div data-testid="mock-about-me-blurb" className={className}>About Me Content</div>
);

const MockSocialLinks = ({ className }: { className?: string }) => (
  <div data-testid="mock-social-links" className={className}>Social Links</div>
);

const MockContactInfo = ({ name, email, showEmail, className }: { name: string; email: string; showEmail: boolean; className?: string }) => (
  <div data-testid="mock-contact-info" className={className}>
    {name} {showEmail && email}
  </div>
);

describe('MainContent component', () => {
  const defaultProps = {
    name: 'Test User',
    email: 'test@example.com',
    profileImageUrl: '/test-image.jpg',
    profileImageAlt: 'Test Profile Image',
    AboutMeBlurbComponent: MockAboutMeBlurb,
    SocialLinksComponent: MockSocialLinks,
    ContactInfoComponent: MockContactInfo
  };

  it('renders mobile layout with profile image', () => {
    render(<MainContent {...defaultProps} />);
    const mobileView = screen.getByTestId('mobile-view');
    expect(mobileView).toBeInTheDocument();
    expect(mobileView).toContainHTML('img');
  });
  
  it('renders AboutMeBlurb component', () => {
    render(<MainContent {...defaultProps} />);
    const aboutMeBlurb = screen.getAllByTestId('mock-about-me-blurb');
    expect(aboutMeBlurb.length).toBeGreaterThan(0);
  });
  
  it('renders SocialLinks component', () => {
    render(<MainContent {...defaultProps} />);
    const socialLinks = screen.getAllByTestId('mock-social-links');
    expect(socialLinks.length).toBeGreaterThan(0);
  });
  
  it('renders ContactInfo component', () => {
    render(<MainContent {...defaultProps} />);
    const contactInfo = screen.getAllByTestId('mock-contact-info');
    expect(contactInfo.length).toBeGreaterThan(0);
  });
});
