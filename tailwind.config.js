/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        'slide': 'slide 1s linear infinite',
      },
      keyframes: {
        slide: {
          '0%': { transform: 'translateX(-100%) skewX(-20deg)' },
          '100%': { transform: 'translateX(500%) skewX(-20deg)' },
        },
      },
    },
  },
  plugins: [],
};
