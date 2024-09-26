/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {

    extend: {
      backgroundColor: {
        //'defaultMode' : '',
        'lightMode': '#E11D48',
        'darkMode': '#1E3A8A',
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      margin: {
        'login': '705px',
      },

      height: {
        'profile': '700px',
        'cart': '700px',
      },
      height: {
        'profile': '700px',
        'cart': '700px',
      }
  
    },

  },
  plugins: [],
};
