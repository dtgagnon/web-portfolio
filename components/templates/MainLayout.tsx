import React from 'react';
import { Navbar, Footer } from '@/components/organisms';
import { ThemeToggle } from '@/components/atoms';
import { SocialLinks } from '@/components/molecules';
import { ChatCard } from '@/components/organisms/chat';

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
  showFooter?: boolean;
  showSocialLinks?: boolean;
  showChat?: boolean;
}

export default function MainLayout({
  children,
  className = '',
  showFooter = true,
  showSocialLinks = true,
  showChat = true
}: MainLayoutProps) {
  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden bg-navy-900 dark:bg-navy-950 text-gray-100 dark:text-white transition-colors">
      {/* Header with fixed height */}
      <header className="flex-shrink-0 flex justify-between items-center px-4 md:px-8 py-3">
        <div className="flex items-center">
          <ThemeToggle />
        </div>
        <div className="flex items-center">
          <Navbar />
        </div>
      </header>
      
      {/* Main content area - takes remaining space and scrolls if needed */}
      <main className={`flex-1 min-h-0 bg-navy-900 dark:bg-navy-950 overflow-auto ${className}`}>
        <div className="flex flex-col justify-center h-full relative px-4 md:px-8 py-4 overflow-auto">
          {showSocialLinks && (
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 ml-4 md:ml-8 z-10">
              <SocialLinks />
            </div>
          )}
          {children}
        </div>
      </main>
      
      {/* Footer with fixed height */}
      {showFooter && <Footer className="flex-shrink-0" />}
      
      {/* Chat component that peeks from bottom */}
      {showChat && (
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 mb-0 z-20">
          <ChatCard />
        </div>
      )}
    </div>
  );
}