import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
  onClick?: () => void;
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
  
  return (
    <Link 
      href={href}
      onClick={onClick}
      className={`transition-colors hover:text-sky-600 dark:hover:text-sky-400 ${isActive ? activeClassName : ''} ${className}`}
    >
      {children}
    </Link>
  );
}