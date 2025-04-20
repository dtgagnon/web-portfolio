import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    fontFamily: {},
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0A192F', // navy
          light: '#172A46',
          dark: '#05101F',
        },
        secondary: {
          DEFAULT: '#F5F0E1', // cream
          light: '#FFFDF5',
          dark: '#E6DCC8',
        },
        accent: {
          DEFAULT: '#A6927B', // desaturated bronze
          light: '#C5B8A5',
          dark: '#7D6B58',
        },
        // Dark mode specific colors
        dark: {
          primary: {
            DEFAULT: '#121212', // dark background
            light: '#1F1F1F',
            dark: '#0A0A0A'
          },
          secondary: {
            DEFAULT: '#1E293B', // dark surface
            light: '#334155',
            dark: '#0F172A'
          },
          accent: {
            DEFAULT: '#64748B', // slate for dark mode accents
            light: '#94A3B8',
            dark: '#475569'
          },
          text: {
            DEFAULT: '#E2E8F0', // light text for dark mode
            muted: '#94A3B8'
          }
        }
      }
    }
  },
  // In Tailwind CSS v4, 'darkMode' config is no longer needed as it's handled by @custom-variant in globals.css
  plugins: []
};

export default config;