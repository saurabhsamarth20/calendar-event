//  @type {import('tailwindcss').Config} 
const withMT = require("@material-tailwind/react/utils/withMT");


module.exports = withMT({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "var(--primary-color)",
        "secondary": "var(--secondary-color)",
        
      },
      fontFamily: {
        sans: ['Roboto', 'Helvetica', 'sans-serif'],
        serif: ['"Times New Roman"', 'Georgia', 'serif'], // Serif fonts
        script: ['"Great Vibes"', 'cursive'], // Script fonts
        poppins: ['Poppins', 'sans-serif']
      },
    },
  },
  plugins: [],
});