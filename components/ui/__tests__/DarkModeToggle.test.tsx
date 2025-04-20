import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import DarkModeToggle from '@/components/features/DarkModeToggle';

const mockSetTheme = vi.fn();
vi.mock('@/components/context/ThemeContext', () => ({
    useTheme: () => ({
        theme: 'light',
        resolvedTheme: 'light',
        setTheme: mockSetTheme
    })
}));

describe('DarkModeToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<DarkModeToggle />);

    // Check if the button is present
    const toggleButton = screen.getByRole('button', { name: /activate dark mode/i });
    expect(toggleButton).toBeInTheDocument();
  });

  it('toggles theme when clicked', async () => {
    const user = userEvent.setup();
    render(<DarkModeToggle />);

    const toggleButton = screen.getByRole('button', { name: /activate dark mode/i });

    // Simulate a click
    await user.click(toggleButton);

    // Check if the theme was set to dark
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
    
    // Note: We don't need to check the aria-label change here because
    // in a real component the aria-label would update after React re-renders
    // But in our test, we've mocked the hook and the DOM isn't actually updated
  });
});