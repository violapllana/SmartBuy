/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@headlessui/react/**/*.{js,jsx,ts,tsx}",
  ],
  plugins: [require('@tailwindcss/forms')],
  theme: {
  extend: {
    animation: {
      snake: 'snakeSlide 1s ease-out forwards',
      snakeOut: 'snakeSlideOut 1s ease-in forwards',
      bounceOnce: 'bounceOnce 0.5s ease-out 1', // 👈 Add this
    },
    keyframes: {
      snakeSlide: {
        '0%': { transform: 'translate(100%, 100%) scale(0.7)', opacity: '0' },
        '60%': { transform: 'translate(0%, 100%) scale(1.05)', opacity: '1' },
        '100%': { transform: 'translate(0%, 0%) scale(1)', opacity: '1' },
      },
      snakeSlideOut: {
        '0%': { transform: 'translate(0%, 0%) scale(1)', opacity: '1' },
        '60%': { transform: 'translate(0%, 100%) scale(1.05)', opacity: '0.5' },
        '100%': { transform: 'translate(100%, 100%) scale(0.7)', opacity: '0' },
      },
      bounceOnce: {
        '0%, 100%': { transform: 'translateY(0)' },
        '50%': { transform: 'translateY(-5px)' }, // 👈 Add bounce
      },
    },
  },
}

};
