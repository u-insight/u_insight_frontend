/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./components/**/*{.jsx,.tsx}"],
  theme: {
    extend: {
      colors: {
        red: "rgb(255, 0, 0)", // 기존 색상에 'red'를 추가
        brand_main: "rgb(62, 175, 14)", // 새로운 브랜드 색상 추가
      },
    },
  },
  plugins: [],
};

export default config;
