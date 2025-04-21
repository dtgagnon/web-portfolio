import React from 'react';
import { ThemeToggle } from '@/components/atomic/atoms';

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
      
      <main className={`flex-1 ${className}`}>
        {children}
      </main>
    </div>
  );
}