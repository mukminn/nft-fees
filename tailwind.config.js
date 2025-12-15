/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'cloud': 'cloud 20s linear infinite',
        'cloud-slow': 'cloud 30s linear infinite',
      },
      keyframes: {
        cloud: {
          '0%': { transform: 'translateX(-100%) translateY(0px)' },
          '50%': { transform: 'translateX(50vw) translateY(-10px)' },
          '100%': { transform: 'translateX(100vw) translateY(0px)' },
        },
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'water': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
    },
  },
  plugins: [],
}

