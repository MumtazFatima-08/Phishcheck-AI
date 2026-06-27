/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        midnight: '#04111f',
        slateblue: '#0d1b2a',
        cyanaccent: '#34d1ff',
        greenaccent: '#12d8a0',
        redaccent: '#ff4d6d',
      },
      boxShadow: {
        glow: '0 0 30px rgba(52, 209, 255, 0.25)',
      },
    },
  },
  plugins: [],
};
