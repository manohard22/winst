/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "lucro-blue": "#2557a7",
        "lucro-dark-blue": "#1a4480",
        "lucro-light-blue": "#e7f1ff",
        "lucro-green": "#2d7738",
        "lucro-orange": "#f5a623",
        "lucro-gray": "#767676",
        "lucro-light-gray": "#f3f2f1",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
