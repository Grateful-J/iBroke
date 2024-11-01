/** @type {import('tailwindcss').Config} */
export default {
  content: ['./public/**/*.html', './src/**/*.{js,jsx,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Helvetica Neue', 'Arial', 'sans-serif'],
      },
      colors: {
        'custom-blue': '#007aff',
        'custom-dark': '#1a1a1a',
        'custom-light': '#f9f9f9',
      },
    },
  },
  plugins: [],
}
