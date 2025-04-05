import type { Config } from 'tailwindcss';
import colors from 'tailwindcss/colors';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    colors: {},
    fontFamily: {},
    extend: {
      colors: {
        cream: {
          DEFAULT: '#faf8f2'
        },
        dark: {
          DEFAULT: '#1c1c1c'
        },
        pink: {
          DEFAULT: '#ff8fa3'
        },
        accentGreen: {
          DEFAULT: '#d4f7d4'
        }
      }
    }
  },
  plugins: []
};

export default config;