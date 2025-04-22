import React from 'react';
import { Navbar, Footer } from '@/components/organisms';
import { ThemeToggle } from '@/components/atoms';

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
  showFooter?: boolean;
}

export default function MainLayout({
  children,
  className = '',
  showFooter = true
}: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black text-black dark:text-white transition-colors">
      <ThemeToggle />
      <Navbar />
      
      <main className={`flex-1 ${className}`}>
        {children}
      </main>
      
      {showFooter && <Footer />}
    </div>
  );
}