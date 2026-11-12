/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../packages/react-ui-kit/src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ["class", '[data-pulse-theme="dark"]'],
  theme: {
    extend: {},
  },
  plugins: [],
};

