/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        headline: ['var(--font-manrope)', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif'],
      },
      colors: {
        primary: "#020035",
        secondary: "#FEB21A",
        background: "#f9f9f9",
        surface: "#ffffff",
        'on-surface': "#1a1c1c",
        'on-surface-variant': "#47464f",
        outline: "#777680",
        error: "#ba1a1a",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}