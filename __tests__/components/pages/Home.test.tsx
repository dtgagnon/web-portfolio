import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Home } from '@/components/pages';
import { MainLayout } from '@/components/templates';
import { ThemeProvider } from '@/providers/ThemeContext';

// Mock the templates to better test the Home component itself
vi.mock('@/components/templates', () => ({
  MainLayout: vi.fn(({ children }) => <div>{children}</div>)
}));

// Mock components to simplify testing
vi.mock('@/components/organisms', () => ({
  Hero: () => <div data-testid="hero-component">Hero Component</div>,
  About: () => <div data-testid="about-component">About Component</div>,
  ContactForm: () => <div data-testid="contact-form">Contact Form</div>
}));

vi.mock('@/components/molecules', () => ({
  SocialLinks: () => <div data-testid="social-links">Social Links</div>,
  ContactInfo: () => <div data-testid="contact-info">Contact Info</div>,
  Card: ({ children }: { children: React.ReactNode }) => <div data-testid="card">{children}</div>,
  NavLink: ({ href, children }: { href: string, children: React.ReactNode }) => (
    <a data-testid="nav-link" href={href}>{children}</a>
  ),
  SearchBar: () => <div data-testid="search-bar">Search Bar</div>,
  Input: ({ label }: { label: string }) => <div data-testid="input">{label}</div>
}));

vi.mock('@/components/organisms/chat', () => ({
  ChatCard: () => <div data-testid="chat-component">Chat Component</div>
}));

describe('Home Page Component', () => {
  let container: HTMLElement;

  beforeEach(() => {
    // Mock the SocialLinks and ChatCard components since they're injected by MainLayout
    vi.mocked(MainLayout).mockImplementation(({ children }) => (
      <div data-testid="main-layout" className="min-h-screen bg-navy-900">
        <div className="absolute left-0">
          <div data-testid="social-links" className="text-xl">Social Links</div>
        </div>
        {children}
        <div className="fixed bottom-0">
          <div data-testid="chat-component">Chat Component</div>
        </div>
      </div>
    ));
    
    const renderResult = render(
      <ThemeProvider>
        <Home />
      </ThemeProvider>
    );
    container = renderResult.container;
  });

  it('renders the profile section with proper structure', () => {
    // Check for main container existence
    expect(screen.getByTestId('main-layout')).toBeInTheDocument();
    
    // Check for profile information
    expect(screen.getByText('Derek Gagnon')).toBeInTheDocument();
    expect(screen.getByText('gagnon.derek@protonmail.com')).toBeInTheDocument();
  });

  it('renders with three-column layout on desktop', () => {
    // Check for the three main sections
    expect(screen.getByText('Derek Gagnon')).toBeInTheDocument(); // Left column
    
    // Check for image container
    const imageContainer = container.querySelector('.rounded-full');
    expect(imageContainer).toBeInTheDocument();
    
    // Check for bio text
    expect(screen.getByText(/Hi! I'm a medical device engineer/)).toBeInTheDocument();
  });

  it('has centered content layout', () => {
    // Main flex container should exist and have proper centering classes
    const mainFlexContainer = container.querySelector('.flex.items-center.justify-center');
    expect(mainFlexContainer).toBeInTheDocument();
  });
});

describe('Home Page Hero Content', () => {
  // We need to create a minimal implementation of the Hero component for testing
  // the specific layout of the profile content
  let container: HTMLElement;
    
  // Test the specific layout of the three-column design
  it('displays profile content with correct positioning', () => {
    const renderResult = render(
      <ThemeProvider>
        <Home />
      </ThemeProvider>
    );
    container = renderResult.container;
    
    // We'll select actual elements based on their content and position
    // Left column - Name and email
    const nameHeading = screen.getByText('Derek Gagnon');
    const leftColumn = nameHeading.closest('div');
    expect(leftColumn).toHaveClass('flex', 'flex-col', 'text-left');
    
    // Center column - Profile photo
    const photoContainer = container.querySelector('.rounded-full.overflow-hidden');
    expect(photoContainer).toBeInTheDocument();
    
    // Right column - Bio text
    const bioText = screen.getByText(/Hi! I'm a medical device engineer/);
    const rightColumn = bioText.closest('div');
    expect(rightColumn).toHaveClass('text-right');
  });
});
