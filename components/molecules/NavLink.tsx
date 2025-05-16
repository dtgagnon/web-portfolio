import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export default function NavLink({
  href,
  children,
  className = '',
  activeClassName = 'font-semibold text-sky-600 dark:text-sky-400',
  onClick
}: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname?.startsWith(`${href}/`);
  
  // Create a handler that prevents default navigation if onClick is provided
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault(); // Prevent default navigation when a custom handler is provided
      onClick(e);
    }
  };
  
  return (
    <Link 
      href={href}
      onClick={handleClick}
      className={`transition-colors hover:text-sky-600 dark:hover:text-sky-400 ${isActive ? activeClassName : ''} ${className}`}
    >
      {children}
    </Link>
  );
}