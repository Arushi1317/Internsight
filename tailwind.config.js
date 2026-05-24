/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Fraunces", "Georgia", "serif"],
      },
      colors: {
        bark: "#3d2f24",
        moss: "#5f7d4f",
        fern: "#8fbc79",
        ember: "#d98d45",
        parchment: "#f4ecd8",
        ink: "#1d2621",
        river: "#4f9ca5",
        berry: "#8b4d6f",
      },
      boxShadow: {
        lantern: "0 24px 80px rgba(43, 34, 23, 0.22)",
        insetline: "inset 0 0 0 1px rgba(61,47,36,.12)",
      },
    },
  },
  plugins: [],
};
