// lib/hooks/useBreakpoint.ts
import { useState, useEffect } from 'react';

const useBreakpoint = (breakpoint: number) => {
  const [isBelowBreakpoint, setIsBelowBreakpoint] = useState(false);

  useEffect(() => {
    // Ensure window is defined (for SSR/Node.js environments during build)
    if (typeof window === 'undefined') {
      // Initialize based on a sensible default or a prop if SSR is critical for this logic
      // For now, defaulting to 'false' (desktop) if window is not available.
      setIsBelowBreakpoint(false);
      return;
    }

    const mediaQuery = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const handleResize = () => setIsBelowBreakpoint(mediaQuery.matches);
    
    handleResize(); // Initial check
    mediaQuery.addEventListener('change', handleResize);
    
    return () => mediaQuery.removeEventListener('change', handleResize);
  }, [breakpoint]);

  return isBelowBreakpoint;
};

export default useBreakpoint;
