/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/index.html",         
    "./src/**/*.{js,jsx,ts,tsx}"     
  ],
  theme: {
    extend: {
      fontFamily: {
        CalSans: ['Cal Sans','sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
        sharetech: ['Share Tech','sans-serif'],
        ancizar: ['Ancizar Sans', 'sans-serif'],
      },
    },
  },
  plugins: [
    require("daisyui"),
    require('tailwindcss-text-stroke'),
  ],
  
};