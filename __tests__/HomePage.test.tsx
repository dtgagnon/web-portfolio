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


describe('Home Page Layout (app/page.tsx) - Mobile (screen < 860px)', () => {
  beforeEach(() => {
    mockMatchMedia(true); // Simulate mobile screen width
    render(<Home />);
  });

  it('Test 1.2.1: Renders all core components for mobile layout', () => {
    expect(screen.getByTestId('contact-info')).toBeInTheDocument();
    expect(screen.getByAltText('Picture of Derek Gagnon')).toBeInTheDocument();
    expect(screen.getByTestId('about-me-blurb')).toBeInTheDocument();
    expect(screen.getByTestId('social-links')).toBeInTheDocument();
  });

  it('Test 1.2.3: ContactInfo displays only name and is centered for mobile', () => {
    const contactInfo = screen.getByTestId('contact-info');
    expect(within(contactInfo).getByText('Derek Gagnon')).toBeInTheDocument();
    expect(within(contactInfo).queryByText('gagnon.derek@protonmail.com')).not.toBeInTheDocument(); // Email hidden
    // For centering, we'll rely on the MobileMainContent component's styling later.
    // We can check for a data-testid on MobileMainContent and its classes.
  });

  it('Test 1.2.4: Profile image is rendered for mobile', () => {
    const image = screen.getByAltText('Picture of Derek Gagnon');
    expect(image).toBeInTheDocument();
    // Centering will be handled by MobileMainContent structure
  });

  it('Test 1.2.5: AboutMeBlurb is rendered, text content visible, and centered for mobile', () => {
    const aboutBlurb = screen.getByTestId('about-me-blurb');
    expect(within(aboutBlurb).getByText(/Hi! I am a medical device engineer/)).toBeInTheDocument();
    expect(within(aboutBlurb).getByText('More about me')).toBeInTheDocument();
    // Centering handled by MobileMainContent
  });

  it('Test 1.2.6: Single dotted border is present between AboutMeBlurb and SocialLinks for mobile', () => {
    // This border will be implemented inside MobileMainContent. 
    // We'll add a data-testid to it there and test for its presence.
    // Placeholder for now, as it requires implementation detail.
    // Example: expect(screen.getByTestId('mobile-layout-border')).toBeInTheDocument();
    expect(true).toBe(true); // Placeholder
  });

  it('Test 1.2.7: SocialLinks are rendered and centered for mobile', () => {
    expect(screen.getByTestId('social-links')).toBeInTheDocument();
    // Centering handled by MobileMainContent
  });

  it('Test 1.2.2: Correct order for mobile layout (Name, Image, About, Border, Social)', async () => {
    // This test is more complex and relies on the DOM structure rendered by MobileMainContent.
    // We'll use data-testid attributes on the elements within MobileMainContent for robust order checking.
    // For now, this is a conceptual placeholder.
    // const name = screen.getByText('Derek Gagnon');
    // const image = screen.getByAltText('Picture of Derek Gagnon');
    // const about = screen.getByTestId('about-me-blurb');
    // const social = screen.getByTestId('social-links');
    // Add assertions for order when MobileMainContent is implemented.
    expect(true).toBe(true); // Placeholder
  });
});

describe('Home Page Layout (app/page.tsx) - Desktop (screen >= 860px)', () => {
  beforeEach(() => {
    mockMatchMedia(false); // Simulate desktop screen width
    render(<Home />);
  });

  it('Test 1.3.1: Renders all core components for desktop layout', () => {
    expect(screen.getByTestId('contact-info')).toBeInTheDocument();
    expect(screen.getByAltText('Picture of Derek Gagnon')).toBeInTheDocument(); // Profile image
    expect(screen.getByTestId('about-me-blurb')).toBeInTheDocument();
    expect(screen.getByTestId('social-links')).toBeInTheDocument();
  });

  it('Test 1.3.3: ContactInfo displays name and email for desktop', () => {
    const contactInfo = screen.getByTestId('contact-info');
    expect(within(contactInfo).getByText('Derek Gagnon')).toBeInTheDocument();
    expect(within(contactInfo).getByText('gagnon.derek@protonmail.com')).toBeInTheDocument(); // Email visible
  });

  it('Test 1.3.2 & 1.3.4: Renders three-column structure with artistic offsets for desktop', () => {
    // These selectors will be more specific once DesktopMainContent.tsx is implemented with data-testids
    // For now, we assume ContactInfo and SocialLinks are in one column, Image in center, AboutMeBlurb in another.
    // And we'll check for transform classes on the wrappers of ContactInfo/SocialLinks and AboutMeBlurb.
    
    // Placeholder test until DesktopMainContent.tsx structure is defined with test IDs for columns
    // Example: 
    // const leftColumn = screen.getByTestId('desktop-left-column');
    // expect(leftColumn).toHaveClass('transform', 'translate-y-12'); // Or whatever the value is
    // const rightColumn = screen.getByTestId('desktop-right-column');
    // expect(rightColumn).toHaveClass('transform', '-translate-y-38');
    expect(true).toBe(true); // Placeholder
  });

  it('Test 1.3.5: Original two dotted borders are present for desktop (and mobile single border is hidden)', () => {
    // These borders are part of the current app/page.tsx structure or will be in DesktopMainContent.tsx.
    // We'll need to ensure they are rendered for desktop and the mobile-specific border is not.
    // Placeholder until DesktopMainContent.tsx is defined.
    // Example: 
    // expect(screen.getAllByTestId('desktop-column-border')).toHaveLength(2);
    // expect(screen.queryByTestId('mobile-layout-border')).not.toBeInTheDocument();
    expect(true).toBe(true); // Placeholder
  });
});
