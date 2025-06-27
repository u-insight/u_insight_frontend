/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

  ],

  theme: {
    extend: {
      colors: {
        red: "rgb(255, 0, 0)",
        brand_main: "rgb(62, 175, 14)",
      },
    },
  },
  plugins: [],
};

export default config;
