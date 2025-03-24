module.exports = {
  content: [
    './client/**/*.{js,jsx,ts,tsx}',
    './client/index.html'
  ],
  theme: {
    extend: {
      colors: {
        cream: '#faf8f2',
        dark: '#1c1c1c',
        pink: '#ff8fa3',
        text: '#4a4a4a'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
      }
    },
  },
  plugins: [],
}