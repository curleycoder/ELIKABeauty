/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Josefin Sans", "system-ui"],
        display: ["Ranade", "Josefin Sans"],
      },
      colors: {
        purplecolor: "#200027",
        goldcolor: "#ceaa5b"
      },
    },
  },
  plugins: [],
}

