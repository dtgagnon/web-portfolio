module.exports = {
  content: [
    './client/**/*.{js,jsx,ts,tsx}',
    './client/index.html'
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          700: 'var(--color-navy)'
        },
        forest: {
          700: 'var(--color-forest)'
        },
        brass: 'var(--color-brass)'
      }
    },
  },
  plugins: [],
}