import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        cream: '#faf8f2',
        dark: '#1c1c1c',
        pink: '#ff8fa3',
        accentGreen: '#d4f7d4'
      }
    }
  },
  plugins: []
};

export default config;
