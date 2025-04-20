import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ThemeProvider, useTheme } from '@/components/context/ThemeContext';
import React, { ReactNode } from 'react';

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
  removeItem: vi.fn(),
  key: vi.fn(),
  length: 0
};

// Mock matchMedia for system theme detection
const mockMatchMedia = vi.fn();

// Create wrapper component that uses ThemeProvider
const wrapper = ({ children }: { children: ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe('ThemeContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup localStorage mock
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true
    });
    
    // Setup matchMedia mock (default to light mode)
    window.matchMedia = mockMatchMedia;
    mockMatchMedia.mockReturnValue({
      matches: false, // false = light mode preference
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    });
  });
  
  afterEach(() => {
    vi.resetAllMocks();
  });
  
  it('provides default system theme when no stored preference exists', () => {
    // Simulate no stored theme preference
    mockLocalStorage.getItem.mockReturnValueOnce(null);
    
    const { result } = renderHook(() => useTheme(), { wrapper });
    
    // Initial theme should be 'system'
    expect(result.current.theme).toBe('system');
  });
  
  it('loads theme from localStorage on initialization', () => {
    // Simulate stored theme preference
    mockLocalStorage.getItem.mockReturnValueOnce('dark');
    
    const { result } = renderHook(() => useTheme(), { wrapper });
    
    // Theme should load from localStorage
    expect(result.current.theme).toBe('dark');
  });
  
  it('updates localStorage when theme changes', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    
    // Change theme to dark
    act(() => {
      result.current.setTheme('dark');
    });
    
    // Check localStorage was updated
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
  });
  
  it('resolves to system preference when theme is set to system', () => {
    // Simulate system dark mode preference
    mockMatchMedia.mockReturnValue({
      matches: true, // true = dark mode preference
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    });
    
    // Initialize with system theme
    mockLocalStorage.getItem.mockReturnValueOnce('system');
    
    const { result } = renderHook(() => useTheme(), { wrapper });
    
    // Theme should be 'system' but resolvedTheme should be 'dark' (system preference)
    expect(result.current.theme).toBe('system');
    expect(result.current.resolvedTheme).toBe('dark');
  });
  
  it('handles theme change when theme is explicitly set', () => {
    // Start with light theme
    mockLocalStorage.getItem.mockReturnValueOnce('light');
    
    const { result } = renderHook(() => useTheme(), { wrapper });
    
    // Initial resolved theme should be light
    expect(result.current.theme).toBe('light');
    expect(result.current.resolvedTheme).toBe('light');
    
    // Change theme to dark
    act(() => {
      result.current.setTheme('dark');
    });
    
    // Resolved theme should now be dark
    expect(result.current.theme).toBe('dark');
    expect(result.current.resolvedTheme).toBe('dark');
  });
  
  it('uses system dark preference when theme is set to system and system prefers dark', () => {
    // Mock system dark mode preference
    mockMatchMedia.mockReturnValue({
      matches: true, // true = dark mode preference
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    });
    
    // Initialize with system theme
    mockLocalStorage.getItem.mockReturnValueOnce('system');
    
    const { result } = renderHook(() => useTheme(), { wrapper });
    
    // Theme should be 'system' but resolvedTheme should be 'dark'
    expect(result.current.theme).toBe('system');
    expect(result.current.resolvedTheme).toBe('dark');
  });
  
  it('uses system light preference when theme is set to system and system prefers light', () => {
    // Mock system light mode preference
    mockMatchMedia.mockReturnValue({
      matches: false, // false = light mode preference
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    });
    
    // Initialize with system theme
    mockLocalStorage.getItem.mockReturnValueOnce('system');
    
    const { result } = renderHook(() => useTheme(), { wrapper });
    
    // Theme should be 'system' but resolvedTheme should be 'light'
    expect(result.current.theme).toBe('system');
    expect(result.current.resolvedTheme).toBe('light');
  });
  
  it('applies dark mode class to document when theme is dark', () => {
    // Create a mock for document.documentElement
    const originalDocumentElement = document.documentElement;
    const mockElement = {
      classList: {
        add: vi.fn(),
        remove: vi.fn(),
      }
    };
    
    // Replace document.documentElement with our mock
    Object.defineProperty(document, 'documentElement', {
      value: mockElement,
      writable: true
    });
    
    // Initialize with dark theme
    mockLocalStorage.getItem.mockReturnValueOnce('dark');
    
    renderHook(() => useTheme(), { wrapper });
    
    // Check that the dark class was added
    expect(mockElement.classList.add).toHaveBeenCalledWith('dark');
    
    // Restore original document.documentElement
    Object.defineProperty(document, 'documentElement', {
      value: originalDocumentElement,
      writable: true
    });
  });
  
  it('removes dark mode class from document when theme is light', () => {
    // Create a mock for document.documentElement
    const originalDocumentElement = document.documentElement;
    const mockElement = {
      classList: {
        add: vi.fn(),
        remove: vi.fn(),
      }
    };
    
    // Replace document.documentElement with our mock
    Object.defineProperty(document, 'documentElement', {
      value: mockElement,
      writable: true
    });
    
    // Initialize with light theme
    mockLocalStorage.getItem.mockReturnValueOnce('light');
    
    renderHook(() => useTheme(), { wrapper });
    
    // Check that the dark class was removed
    expect(mockElement.classList.remove).toHaveBeenCalledWith('dark');
    
    // Restore original document.documentElement
    Object.defineProperty(document, 'documentElement', {
      value: originalDocumentElement,
      writable: true
    });
  });
});
