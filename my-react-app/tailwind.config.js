/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2E8B57", // Jungle Green
          light: "#3CB371", // Medium Sea Green
          dark: "#1B5E20", // Dark Green
        },
        secondary: {
          DEFAULT: "#E8F5E9", // Light Green
          light: "#F1F8E9", // Very Light Green
          dark: "#C8E6C9", // Pale Green
        },
        accent: {
          DEFAULT: "#DAA520", // GoldenRod
          light: "#FFD700", // Gold
        },
        muted: {
          DEFAULT: "#78716C", // Stone 500
          light: "#A8A29E", // Stone 400
        },
        background: "#FAFAF9", // Stone 50
        surface: "#FFFFFF",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        serif: ["Playfair Display", "serif"],
      },
      container: {
        center: true,
        padding: "1rem",
        screens: {
          "2xl": "1400px",
        },
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        }
      },
      animation: {
        marquee: 'marquee 25s linear infinite',
      },
    },
  },
  plugins: [],
}
