/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        'green-mannwork': '#2d7a3e',
        'green-mannwork-light': '#e3f5e9',
        'background': '#FDFBF9',
        'background-white': '#FDFDFB',
        'text-primary': '#333333',
        'text-secondary': '#7D7D7D',
      }
    },
  },
  plugins: [],
};