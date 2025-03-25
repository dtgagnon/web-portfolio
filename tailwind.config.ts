import type { Config } from 'tailwindcss';

export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#faf8f2',
        dark: '#1c1c1c',
        pink: '#ff8fa3',
        accent: '#d4f7d4',
      },
    },
  },
  plugins: [],
} satisfies Config