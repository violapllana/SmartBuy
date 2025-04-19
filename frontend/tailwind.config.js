/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Path to your JS and JSX files
  ],
  theme: {
    extend: {
      colors: {
        frost: '#00b8d4', // Custom cool color
        ocean: '#00838f',
        glacier: '#4caf50',
      },
    },
  },
  plugins: [],
};
