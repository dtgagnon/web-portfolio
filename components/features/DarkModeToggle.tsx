// "use client"; // Directive for client component

// import { useDarkMode } from '../context/DarkModeContext';

// export default function DarkModeToggle() {
//   const { isDarkMode, toggleDarkMode } = useDarkMode();
  
//   return (
//     <button
//       onClick={toggleDarkMode}
//       className="fixed top-4 right-4 p-2 rounded-full bg-opacity-20 hover:bg-opacity-30 transition-colors"
//       style={{
//         backgroundColor: isDarkMode ? '#121d1d' : '#fff3e0',
//         color: isDarkMode ? '#fff3e0' : '#171717'
//       }}
//     >
//       {isDarkMode ? '🌙' : '☀️'}
//     </button>
//   );
// }
"use client"; // Directive for client component

import { useDarkMode } from '../context/DarkModeContext';

// Define SVG components for Sun and Moon icons
// Using stroke="currentColor" makes them inherit the button's text color
// Size set to 20x20 (1.25rem) based on memory preference
const SunIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20" // 1.25rem
    height="20" // 1.25rem
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor" // Inherits color from parent
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true" // Hide decorative icon from screen readers
  >
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
  </svg>
);

const MoonIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20" // 1.25rem
    height="20" // 1.25rem
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor" // Inherits color from parent
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true" // Hide decorative icon from screen readers
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
  </svg>
);


export default function DarkModeToggle() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <button
      onClick={toggleDarkMode}
      // Add descriptive label for accessibility
      aria-label={isDarkMode ? "Activate light mode" : "Activate dark mode"}
      title={isDarkMode ? "Activate light mode" : "Activate dark mode"} // Tooltip
      className="fixed top-4 right-4 p-2 rounded-full bg-opacity-20 hover:bg-opacity-30 transition-colors flex items-center justify-center" // Added flex for centering icon
      style={{
        backgroundColor: isDarkMode ? '#2a2a2a' : '#f5e9d6',
        color: isDarkMode ? '#fff3e0' : '#171717', // Text color (SVG inherits this)
        // Ensure button is large enough for the icon + padding
        width: '40px', // Example size (adjust as needed)
        height: '40px', // Example size (adjust as needed)
      }}
    >
      {/* Conditionally render the appropriate SVG icon */}
      {isDarkMode ? <MoonIcon /> : <SunIcon />}
    </button>
  );
}