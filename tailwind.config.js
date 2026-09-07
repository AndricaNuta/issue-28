/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: { DEFAULT: '#F1EBE1', card: '#FBF7F1' },
        ink: '#1C1917',
        accent: { DEFAULT: '#B5342A', soft: '#F2DED9' },
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        script: ['Sacramento', 'cursive'],
        sans: ['Figtree', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
