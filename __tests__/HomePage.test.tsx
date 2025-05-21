import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import HomeRoute from '@/app/page'; // Testing the Next.js page route component
import { ThemeProvider } from '@/providers/ThemeContext'; // ThemeProvider for context

// Mock the content component that app/page.tsx now delegates to
vi.mock('@/components/pages', async (importOriginal) => {
  const original = await importOriginal<typeof import('@/components/pages')>();
  return {
    ...original,
    Home: vi.fn(() => <div data-testid="home-page-content-mock">HomePageContent Mock</div>),
  };
});

// Mock Navbar and ChatCard as they are direct children of app/page.tsx's layout
vi.mock('@/components/organisms/Navbar', () => ({
  default: ({ className }: { className?: string }) => (
    <nav data-testid="navbar-mock" className={className}>
      Navbar Mock
    </nav>
  )
}));

vi.mock('@/components/organisms/chat/ChatCard', () => ({
  default: ({ content }: { content: string }) => ( // Ensure props match if needed
    <div data-testid="chat-card-mock">ChatCard Mock: {content}</div>
  )
}));


describe('Home Page Route (app/page.tsx)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    render(
      <ThemeProvider>
        <HomeRoute />
      </ThemeProvider>
    );
  });

  it('renders the Navbar component', () => {
    expect(screen.getByTestId('navbar-mock')).toBeInTheDocument();
  });

  it('renders the HomePageContent component (mocked)', () => {
    expect(screen.getByTestId('home-page-content-mock')).toBeInTheDocument();
  });

  it('renders the footer structure with ChatCard', () => {
    // Check for footer elements. Since the footer is simple text and ChatCard,
    // we can check for their presence.
    expect(screen.getByText(/Derek Gagnon/)).toBeInTheDocument(); // Part of the copyright
    expect(screen.getByText(/All rights reserved/)).toBeInTheDocument();
    expect(screen.getByTestId('chat-card-mock')).toBeInTheDocument();
  });

  it('renders the main structural elements of the page', () => {
    const header = screen.getByRole('banner'); // <header>
    const main = screen.getByRole('main');    // <main>
    const footer = screen.getByRole('contentinfo'); // <footer>

    expect(header).toBeInTheDocument();
    expect(main).toBeInTheDocument();
    expect(footer).toBeInTheDocument();

    // Check if Navbar is in the header
    expect(header).toContainElement(screen.getByTestId('navbar-mock'));
    // Check if HomePageContent mock is in main
    expect(main).toContainElement(screen.getByTestId('home-page-content-mock'));
    // Check if ChatCard mock is in the footer
    expect(footer).toContainElement(screen.getByTestId('chat-card-mock'));
  });
});
