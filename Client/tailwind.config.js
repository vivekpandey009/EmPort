/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        Grotesk: ["Space Grotesk", "sans-serif"],
        Petit: ["Petit Formal Script", "cursive", "sans-serif"],
        Pacifico: ["Pacifico", "cursive", "sans-serif"],
      },
    },
  },
  plugins: [],
};
