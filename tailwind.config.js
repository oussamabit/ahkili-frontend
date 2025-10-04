/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#10b981',    // Green for mental health/growth
        secondary: '#6366f1',  // Indigo
        accent: '#f59e0b',     // Amber for warmth
      }
    },
  },
  plugins: [],
}