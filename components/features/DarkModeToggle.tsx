"use client";
import { useDarkMode } from "@/components/context/DarkModeContext";

function SunIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
    </svg>
  );
}

export default function DarkModeToggle() {
  const { theme, resolvedTheme, setTheme } = useDarkMode();

  // Toggle between light and dark, regardless of current theme
  const handleClick = () => {
    // If in system mode, toggle to the opposite of the resolved theme
    if (theme === 'system') {
      setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
    } else {
      setTheme(theme === 'dark' ? 'light' : 'dark');
    }
  };

  // Icon and label for the toggle button
  const icon = resolvedTheme === 'dark' ? <MoonIcon /> : <SunIcon />;
  const label = resolvedTheme === 'dark' ? 'Activate light mode' : 'Activate dark mode';

  return (
    <button
      onClick={handleClick}
      aria-label={label}
      title={label}
      className="fixed top-4 right-4 p-2 rounded-full bg-gray-900/20 hover:bg-gray-900/30 dark:bg-amber-50/20 dark:hover:bg-amber-50/30 text-gray-900 dark:text-amber-50 transition-colors flex items-center justify-center w-10 h-10"
    >
      {icon}
    </button>
  );
}
