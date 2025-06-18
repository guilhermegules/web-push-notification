const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      animation: {
        'fade-in-out': 'fadeInOut 3s ease-in-out',
      },
      keyframes: {
        fadeInOut: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '10%': { opacity: 1, transform: 'translateY(0)' },
          '90%': { opacity: 1 },
          '100%': { opacity: 0, transform: 'translateY(10px)' },
        },
      },
    },
  },
  plugins: [],
};
