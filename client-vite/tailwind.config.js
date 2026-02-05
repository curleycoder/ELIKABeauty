/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Lato", "system-ui", "sans-serif"],
      },
      colors: {
        purplecolor: "#200027",
        goldcolor: "#ceaa5b"
      },
    },
  },
  plugins: [],
}

