"use client";
import { useTheme } from "@/providers/ThemeContext";

function SunIcon() {
  return (
    <svg
      className="group"
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="5" />
      <g className="sun-rays origin-center group-hover:animate-sunRayRotation">
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </g>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      className="group"
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
      <g className="moon-stars origin-center opacity-0 group-hover:opacity-100">
        {/* Star 1 Group - immediate animation */}
        <g className="group-hover:animate-twinkle">
          {/* Star 1: Centered at (18,5) - 1px up, 1px left */}
          <line x1="17" y1="5" x2="19" y2="5" strokeWidth={1.5} />
          <line x1="18" y1="4" x2="18" y2="6" strokeWidth={1.5} />
        </g>
        {/* Star 2 Group - delayed animation */}
        <g className="group-hover:animate-twinkle-delayed">
          {/* Star 2: Centered at (21,8), 'x' shape */}
          <line x1="20" y1="7" x2="22" y2="9" strokeWidth={1.5} /> {/* Diagonal \ */}
          <line x1="22" y1="7" x2="20" y2="9" strokeWidth={1.5} /> {/* Diagonal /  */}
        </g>
      </g>
    </svg>
  );
}

export default function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();

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
      className="text-gray-900 dark:text-amber-50 transition-colors flex items-center justify-center"
    >
      {icon}
    </button>
  );
}
