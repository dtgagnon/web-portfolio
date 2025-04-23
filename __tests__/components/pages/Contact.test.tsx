import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Contact from '@/components/pages/Contact';
import { MainLayout, SectionLayout } from '@/components/templates';
import { ThemeProvider } from '@/providers/ThemeContext';

// Mock the templates to better test the Contact component itself
vi.mock('@/components/templates', () => ({
  MainLayout: vi.fn(({ children }) => <div data-testid="main-layout">{children}</div>),
  SectionLayout: vi.fn(({ children, title, subtitle, centered }) => (
    <div data-testid="section-layout" data-centered={centered.toString()}>
      <h1>{title}</h1>
      <p>{subtitle}</p>
      {children}
    </div>
  ))
}));

// Mock components to simplify testing
vi.mock('@/components/organisms', () => ({
  ContactForm: () => <div data-testid="contact-form">Contact Form</div>
}));

vi.mock('@/components/molecules', () => ({
  SocialLinks: ({ direction }: { direction: string }) => 
    <div data-testid="social-links" data-direction={direction}>Social Links</div>
}));

describe('Contact Page Component', () => {
  let container: HTMLElement;

  beforeEach(() => {
    const renderResult = render(
      <ThemeProvider>
        <Contact />
      </ThemeProvider>
    );
    container = renderResult.container;
  });

  it('renders the contact page with proper structure', () => {
    // Check for main container existence
    expect(screen.getByTestId('main-layout')).toBeInTheDocument();
    
    // Check for section layout with correct props
    const sectionLayout = screen.getByTestId('section-layout');
    expect(sectionLayout).toBeInTheDocument();
    expect(sectionLayout).toHaveAttribute('data-centered', 'true');
    
    // Check for title and subtitle
    expect(screen.getByText('Get in Touch')).toBeInTheDocument();
    expect(screen.getByText(/I'd love to hear from you/)).toBeInTheDocument();
  });

  it('displays contact information sections', () => {
    // Check for contact info headings
    expect(screen.getByText('Contact Information')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Connect with me')).toBeInTheDocument();
    expect(screen.getByText('Location')).toBeInTheDocument();
    
    // Check for actual contact details
    expect(screen.getByText('gagnon.derek@protonmail.com')).toBeInTheDocument();
    expect(screen.getByText('Boston, Massachusetts')).toBeInTheDocument();
  });

  it('renders the contact form', () => {
    // Check for contact form
    expect(screen.getByTestId('contact-form')).toBeInTheDocument();
  });

  it('renders social links with row direction', () => {
    // Check for social links
    const socialLinks = screen.getByTestId('social-links');
    expect(socialLinks).toBeInTheDocument();
    expect(socialLinks).toHaveAttribute('data-direction', 'row');
  });

  it('has responsive grid layout', () => {
    // Check for grid container
    const gridContainer = screen.getByTestId('section-layout').querySelector('.grid');
    expect(gridContainer).toHaveClass('grid-cols-1');
    expect(gridContainer).toHaveClass('gap-12');
    
    // Since we're using mocked components, we can't access the actual column spans
    // but we can verify the overall grid structure
    const contactInfo = screen.getByText('Contact Information').closest('div');
    expect(contactInfo).toBeTruthy();
    
    const contactForm = screen.getByTestId('contact-form').closest('div');
    expect(contactForm).toBeTruthy();
  });
});
