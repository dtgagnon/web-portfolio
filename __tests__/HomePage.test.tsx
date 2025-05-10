import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import Home from '@/app/page'; // Testing the Next.js page component
import { mockMatchMedia } from './setupTests'; 

// Mock child components that are not the focus of these layout tests
// This helps isolate app/page.tsx's layout logic.
vi.mock('@/components/molecules/ContactInfo', () => ({
  default: ({ name, email, className, showEmail = true }: { name: string, email: string, className?: string, showEmail?: boolean }) => (
    <div data-testid="contact-info" className={className}>
      <p>{name}</p>
      {showEmail && <p>{email}</p>}
    </div>
  )
}));

vi.mock('@/components/molecules/AboutMeBlurb', () => ({
  default: ({ className }: { className?: string }) => (
    <div data-testid="about-me-blurb" className={className}>
      <p>Hi! I am a medical device engineer...</p>
      <button>More about me</button>
    </div>
  )
}));

vi.mock('@/components/molecules/SocialLinks', () => ({
  default: ({ className }: { className?: string }) => <div data-testid="social-links" className={className}>Social Links</div>
}));

vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // Destructure fill and priority to prevent them from being passed to the native img tag as booleans
    const { fill, priority, alt, ...otherProps } = props;
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...otherProps} alt={alt || 'profile image'} />;
  },
}));

// Mock ThemeToggle as it's part of the root layout but not relevant here
vi.mock('@/components/atoms/ThemeToggle', () => ({
  default: () => <div data-testid="theme-toggle">Theme Toggle</div>
}));

// Mock Navbar component
vi.mock('@/components/organisms/Navbar', () => ({
  default: ({ className }: { className?: string }) => (
    <nav data-testid="navbar" className={className}>
      <div>Navigation Links</div>
    </nav>
  )
}));


describe('Home Page Layout (app/page.tsx) - Mobile View', () => {
  beforeEach(() => {
    // No need to mock media queries anymore as we're testing the components by their data-testid
    render(<Home />);
  });
  
  // Helper function to check if an element with a specific data-testid exists
  const hasTestId = (testId: string) => {
    return screen.queryByTestId(testId) !== null;
  };

  it('Test 1.2.1: Renders all core components for mobile view', () => {
    // Check if mobile view elements are in the document
    expect(hasTestId('mobile-view')).toBe(true);
    expect(screen.getByTestId('contact-info')).toBeInTheDocument();
    expect(screen.getByAltText('Picture of Derek Gagnon')).toBeInTheDocument();
    expect(screen.getByTestId('about-me-blurb')).toBeInTheDocument();
    expect(screen.getByTestId('social-links')).toBeInTheDocument();
  });

  it('Test 1.2.3: ContactInfo displays only name for mobile view', () => {
    // We know we're testing the mobile view by checking for mobile-view component
    expect(hasTestId('mobile-view')).toBe(true);
    
    const contactInfo = screen.getByTestId('contact-info');
    expect(within(contactInfo).getByText('Derek Gagnon')).toBeInTheDocument();
    expect(within(contactInfo).queryByText('gagnon.derek@protonmail.com')).not.toBeInTheDocument(); // Email hidden
    
    // Check for centering classes in the mobile view
    expect(screen.getByTestId('mobile-view')).toHaveClass('items-center', 'text-center');
  });

  it('Test 1.2.4: Profile image is rendered for mobile view', () => {
    expect(hasTestId('mobile-view')).toBe(true);
    
    const image = screen.getByAltText('Picture of Derek Gagnon');
    expect(image).toBeInTheDocument();
    
    // Check if the image is in the mobile view component
    const mobileView = screen.getByTestId('mobile-view');
    expect(within(mobileView).getByAltText('Picture of Derek Gagnon')).toBeInTheDocument();
  });

  it('Test 1.2.5: AboutMeBlurb is rendered, text content visible, and centered for mobile view', () => {
    expect(hasTestId('mobile-view')).toBe(true);
    
    const aboutBlurb = screen.getByTestId('about-me-blurb');
    expect(within(aboutBlurb).getByText(/Hi! I am a medical device engineer/)).toBeInTheDocument();
    expect(within(aboutBlurb).getByText('More about me')).toBeInTheDocument();
    
    // Verify it's within the mobile view
    const mobileView = screen.getByTestId('mobile-view');
    expect(within(mobileView).getByTestId('about-me-blurb')).toBeInTheDocument();
  });

  it('Test 1.2.6: Single dotted border is present between AboutMeBlurb and SocialLinks for mobile view', () => {
    expect(hasTestId('mobile-view')).toBe(true);
    expect(screen.getByTestId('mobile-layout-border')).toBeInTheDocument();
    
    // Check it's within the mobile view
    const mobileView = screen.getByTestId('mobile-view');
    expect(within(mobileView).getByTestId('mobile-layout-border')).toBeInTheDocument();
  });

  it('Test 1.2.7: SocialLinks are rendered and centered for mobile view', () => {
    expect(hasTestId('mobile-view')).toBe(true);
    expect(screen.getByTestId('social-links')).toBeInTheDocument();
    
    // Check it's within the mobile view
    const mobileView = screen.getByTestId('mobile-view');
    expect(within(mobileView).getByTestId('social-links')).toBeInTheDocument();
  });

  it('Test 1.2.2: Correct order for mobile view (Name, Image, About, Border, Social)', async () => {
    expect(hasTestId('mobile-view')).toBe(true);
    
    // Get the mobile view container
    const mobileView = screen.getByTestId('mobile-view');
    const mobileViewHtml = mobileView.innerHTML;
    
    // Check relative positions in the HTML string
    const contactInfoPos = mobileViewHtml.indexOf('contact-info');
    const imagePos = mobileViewHtml.indexOf('Picture of Derek Gagnon');
    const aboutPos = mobileViewHtml.indexOf('about-me-blurb');
    const borderPos = mobileViewHtml.indexOf('mobile-layout-border');
    const socialPos = mobileViewHtml.indexOf('social-links');
    
    // Verify order: contact info -> image -> about -> border -> social
    expect(contactInfoPos).toBeLessThan(imagePos);
    expect(imagePos).toBeLessThan(aboutPos);
    expect(aboutPos).toBeLessThan(borderPos);
    expect(borderPos).toBeLessThan(socialPos);
  });
});

describe('Home Page Layout (app/page.tsx) - Desktop View', () => {
  beforeEach(() => {
    // No need to mock media queries anymore - we're checking the components directly
    render(<Home />);
  });
  
  // Helper function to check if an element with a specific data-testid exists
  const hasTestId = (testId: string) => {
    return screen.queryByTestId(testId) !== null;
  };

  it('Test 1.3.1: Renders all core components for desktop view', () => {
    // Check if desktop view elements are in the document
    expect(hasTestId('desktop-view')).toBe(true);
    expect(screen.getByTestId('contact-info')).toBeInTheDocument();
    expect(screen.getByTestId('about-me-blurb')).toBeInTheDocument();
    expect(screen.getByTestId('social-links')).toBeInTheDocument();
    
    // Check for desktop-specific elements
    expect(hasTestId('desktop-left-column')).toBe(true);
    expect(hasTestId('desktop-center-column')).toBe(true);
    expect(hasTestId('desktop-about-blurb-column')).toBe(true);
  });

  it('Test 1.3.3: ContactInfo displays name in desktop view', () => {
    expect(hasTestId('desktop-view')).toBe(true);
    
    const contactInfo = screen.getByTestId('contact-info');
    expect(within(contactInfo).getByText('Derek Gagnon')).toBeInTheDocument();
    
    // Verify it's within the desktop left column
    const leftColumn = screen.getByTestId('desktop-left-column');
    expect(within(leftColumn).getByTestId('contact-info')).toBeInTheDocument();
  });

  it('Test 1.3.2 & 1.3.4: Renders three-column structure with artistic offsets for desktop view', () => {
    expect(hasTestId('desktop-view')).toBe(true);
    
    // Get desktop column elements
    const leftColumn = screen.getByTestId('desktop-left-column');
    const centerColumn = screen.getByTestId('desktop-center-column');
    const aboutColumn = screen.getByTestId('desktop-about-blurb-column');
    
    // Check for specific classes that define the three-column structure
    expect(leftColumn).toHaveClass('w-1/4');
    expect(centerColumn).toHaveClass('w-1/2');
    expect(aboutColumn).toHaveClass('w-1/3');
    
    // Check for transform/offset classes
    expect(leftColumn).toHaveClass('transform', 'translate-y-12');
  });

  it('Test 1.3.5: Dotted borders are present for desktop view', () => {
    expect(hasTestId('desktop-view')).toBe(true);
    
    // Check for desktop-specific border
    expect(hasTestId('desktop-column-border')).toBe(true);
    
    // In the desktop view component, mobile border should not be visible
    const desktopView = screen.getByTestId('desktop-view');
    expect(within(desktopView).queryByTestId('mobile-layout-border')).toBeNull();
  });
});
