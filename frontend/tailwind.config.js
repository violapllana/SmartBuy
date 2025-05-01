/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@headlessui/react/**/*.{js,jsx,ts,tsx}",
  ],
  plugins: [require('@tailwindcss/forms')],
  theme: {
    extend: {},
  },
}
