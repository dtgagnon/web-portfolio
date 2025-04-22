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
    <div className="min-h-screen flex flex-col bg-navy-900 dark:bg-navy-950 text-gray-100 dark:text-white transition-colors">
      <header className="flex justify-between items-center px-4 md:px-8 py-4">
        <div className="flex items-center">
          <ThemeToggle />
        </div>
        <div className="flex items-center">
          <Navbar />
        </div>
      </header>
      
      <main className={`min-h-screen bg-navy-900 dark:bg-navy-950 flex-1 ${className}`}>
        <div className="flex flex-col justify-center h-full relative px-4 md:px-8">
          {showSocialLinks && (
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 ml-4 md:ml-8">
              <SocialLinks />
            </div>
          )}
          {children}
        </div>
      </main>
      
      {showFooter && <Footer />}
      
      {showChat && (
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 mb-0">
          <ChatCard />
        </div>
      )}
    </div>
  );
}